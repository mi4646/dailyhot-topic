// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fn main() {
//   app_lib::run();
// }

use tauri::command;

#[command]
async fn fetch_hot_data(name: String) -> Result<String, String> {
    let url = if name == "zhihu" {
        "https://api.zhihu.com/topstory/hot-lists/total?limit=10&reverse_order=0".to_string()
    } else {
        format!("https://api-hot.imsyy.top/{}?cache=true", name)
    };

    let response = reqwest::get(&url).await.map_err(|e| e.to_string())?;
    let text: String = response.text().await.map_err(|e| e.to_string())?;
    Ok(text)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_hot_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
