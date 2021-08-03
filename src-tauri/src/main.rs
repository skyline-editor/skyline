#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn remove_dir_recursive(path: String) -> Result<(), String> {
  match std::fs::remove_dir_all(path) {
    Ok(_) => Ok(()),
    Err(err) => Err(err.to_string()),
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![remove_dir_recursive])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
