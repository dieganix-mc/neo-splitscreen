#define UNICODE
#define _UNICODE
#include <windows.h>
#include <string>
#include <vector>
#include <iostream>
#include <sstream>

static std::wstring escape(const std::wstring& value) {
  std::wstring out;
  for (wchar_t c : value) {
    if (c == L'\\' || c == L'"') { out += L'\\'; out += c; }
    else if (c == L'\n') out += L"\\n";
    else if (c >= 32) out += c;
  }
  return out;
}

static std::wstring processName(DWORD pid) {
  HANDLE process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, FALSE, pid);
  if (!process) return L"";
  wchar_t buffer[32768]; DWORD size = 32768;
  std::wstring result;
  if (QueryFullProcessImageNameW(process, 0, buffer, &size)) {
    result.assign(buffer, size);
    auto slash = result.find_last_of(L"\\/");
    if (slash != std::wstring::npos) result = result.substr(slash + 1);
  }
  CloseHandle(process);
  return result;
}

struct WindowRecord { HWND handle; DWORD pid; std::wstring title; };
static BOOL CALLBACK collectWindow(HWND hwnd, LPARAM data) {
  if (!IsWindowVisible(hwnd) || GetWindow(hwnd, GW_OWNER)) return TRUE;
  DWORD pid = 0; GetWindowThreadProcessId(hwnd, &pid);
  std::wstring exe = processName(pid);
  if (_wcsicmp(exe.c_str(), L"javaw.exe") && _wcsicmp(exe.c_str(), L"java.exe")) return TRUE;
  wchar_t title[1024] = {};
  GetWindowTextW(hwnd, title, 1024);
  if (!title[0]) return TRUE;
  reinterpret_cast<std::vector<WindowRecord>*>(data)->push_back({hwnd, pid, title});
  return TRUE;
}

static std::vector<WindowRecord> windows() {
  std::vector<WindowRecord> result;
  EnumWindows(collectWindow, reinterpret_cast<LPARAM>(&result));
  return result;
}

static int listWindows() {
  auto items = windows();
  std::wcout << L"[";
  bool first = true;
  for (const auto& item : items) {
    if (!first) std::wcout << L","; first = false;
    std::wcout << L"{\"hwnd\":" << reinterpret_cast<uintptr_t>(item.handle)
      << L",\"pid\":" << item.pid << L",\"title\":\"" << escape(item.title) << L"\"}";
  }
  std::wcout << L"]";
  return 0;
}

static int listDevices() {
  UINT count = 0;
  if (GetRawInputDeviceList(nullptr, &count, sizeof(RAWINPUTDEVICELIST)) != 0) return 2;
  std::vector<RAWINPUTDEVICELIST> devices(count);
  if (GetRawInputDeviceList(devices.data(), &count, sizeof(RAWINPUTDEVICELIST)) == static_cast<UINT>(-1)) return 2;
  std::wcout << L"["; bool first = true;
  for (UINT i = 0; i < count; ++i) {
    const auto& item = devices[i];
    if (item.dwType != RIM_TYPEMOUSE && item.dwType != RIM_TYPEKEYBOARD) continue;
    UINT size = 0;
    GetRawInputDeviceInfoW(item.hDevice, RIDI_DEVICENAME, nullptr, &size);
    std::vector<wchar_t> name(size + 1, 0);
    if (size && GetRawInputDeviceInfoW(item.hDevice, RIDI_DEVICENAME, name.data(), &size) == static_cast<UINT>(-1)) continue;
    if (!first) std::wcout << L","; first = false;
    std::wcout << L"{\"handle\":" << reinterpret_cast<uintptr_t>(item.hDevice)
      << L",\"type\":\"" << (item.dwType == RIM_TYPEMOUSE ? L"mouse" : L"keyboard")
      << L"\",\"name\":\"" << escape(name.data()) << L"\"}";
  }
  std::wcout << L"]";
  return 0;
}

static int layout(bool vertical) {
  auto items = windows();
  if (items.size() != 2) { std::wcerr << L"Expected exactly two visible Java windows"; return 3; }
  RECT area{};
  if (!SystemParametersInfoW(SPI_GETWORKAREA, 0, &area, 0)) return 4;
  int width = area.right - area.left, height = area.bottom - area.top;
  for (int i = 0; i < 2; ++i) {
    HWND hwnd = items[i].handle;
    ShowWindow(hwnd, SW_RESTORE);
    LONG_PTR style = GetWindowLongPtrW(hwnd, GWL_STYLE);
    style &= ~(WS_CAPTION | WS_THICKFRAME | WS_MINIMIZEBOX | WS_MAXIMIZEBOX);
    SetWindowLongPtrW(hwnd, GWL_STYLE, style);
    int x = vertical ? area.left + (i * width / 2) : area.left;
    int y = vertical ? area.top : area.top + (i * height / 2);
    int w = vertical ? (i ? width - width / 2 : width / 2) : width;
    int h = vertical ? height : (i ? height - height / 2 : height / 2);
    if (!SetWindowPos(hwnd, nullptr, x, y, w, h, SWP_NOZORDER | SWP_FRAMECHANGED)) return 5;
  }
  std::wcout << L"{\"ok\":true}";
  return 0;
}

int wmain(int argc, wchar_t** argv) {
  if (argc == 2 && !wcscmp(argv[1], L"devices")) return listDevices();
  if (argc == 2 && !wcscmp(argv[1], L"windows")) return listWindows();
  if (argc == 3 && !wcscmp(argv[1], L"layout")) {
    if (!wcscmp(argv[2], L"vertical")) return layout(true);
    if (!wcscmp(argv[2], L"horizontal")) return layout(false);
  }
  std::wcerr << L"Usage: neo_windows devices|windows|layout vertical|layout horizontal";
  return 1;
}
