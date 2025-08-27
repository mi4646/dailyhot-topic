// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::header::{HeaderMap, HeaderValue, REFERER};

#[tauri::command]
async fn fetch_hot_data(name: String) -> Result<String, String> {
    let url = if name == "zhihu" {
        "https://api.zhihu.com/topstory/hot-lists/total?limit=10&reverse_order=0".to_string()
    } else if name == "v2ex" {
        "https://www.v2ex.com/api/topics/hot.json".to_string()
    } else if name == "github" {
        "https://trend.doforce.dpdns.org/repo".to_string()
    } else if name == "xinwenlianbo" {
        "https://api.cntv.cn/NewVideo/getVideoListByColumn?id=TOPC1451528971114112&n=10&sort=desc&p=1&mode=0&serviceId=tvcctv".to_string()
    } else if name == "douban-movie" {
        "https://m.douban.com/rexxar/api/v2/subject_collection/movie_real_time_hotest/items?type=movie&start=0&count=10&for_mobile=1".to_string()
    } else {
        format!("https://api-hot.imsyy.top/{}?cache=true", name)
    };

    let client = reqwest::Client::new();

    let response = if name == "douban-movie" {
        // 自定义 header
        let mut headers = HeaderMap::new();
        headers.insert(
            REFERER,
            HeaderValue::from_static("https://m.douban.com/subject_collection/movie_real_time_hotest"),
        );

        println!("[tauri]: Fetching Douban movie data with custom headers...");

        client
            .get(&url)
            .headers(headers)
            .send()
            .await
            .map_err(|e| e.to_string())?
    } else {
        // 普通请求
        reqwest::get(&url).await.map_err(|e| e.to_string())?
    };

    let text = response.text().await.map_err(|e| e.to_string())?;

    Ok(text)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_hot_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
