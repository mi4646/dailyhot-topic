// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::header::{HeaderMap, HeaderValue, REFERER, CONTENT_TYPE};
use base64::{engine::general_purpose, Engine as _};

#[tauri::command]
// 根据名称参数从各种来源获取热门数据
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
        // format!("https://api-hot.imsyy.top/{}?cache=true", name)
         format!("https://daily-hot-api-zeta-six.vercel.app/{}?cache=true", name)
    };

    let client = reqwest::Client::new();

    let response = if name == "douban-movie" {
        // 自定义 header
        let mut headers = HeaderMap::new();
        headers.insert(
            REFERER,
            HeaderValue::from_static("https://m.douban.com/subject_collection/movie_real_time_hotest"),
        );

        // println!("[tauri]: Fetching Douban movie data with custom headers...");

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

    // println!("[tauri]: Fetched data from {} successfully.\n", name);
    let text = response.text().await.map_err(|e| e.to_string())?;

    Ok(text)
}

#[tauri::command]
// 根据图片 URL 获取图片的 Data URL（Base64 编码），并加上 Referer 伪装成从豆瓣页面加载，避免 403
async fn fetch_image_data_url(url: String) -> Result<String, String> {
    let client = reqwest::Client::new();

    // 自定义 header（加 Referer 伪装成从豆瓣页面加载）
    let mut headers = HeaderMap::new();
    headers.insert(REFERER, HeaderValue::from_static("https://m.douban.com/"));

    let resp = client
        .get(&url)
        .headers(headers)
        .send()
        .await
        .map_err(|e| format!("request error: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("http status: {}", resp.status()));
    }

    // 取 content-type，防止 webp/jpg 混淆
    let ct = resp
        .headers()
        .get(CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("image/jpeg")
        .to_string();

    let bytes = resp.bytes().await.map_err(|e| e.to_string())?;
    let b64 = general_purpose::STANDARD.encode(bytes);

    Ok(format!("data:{};base64,{}", ct, b64))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            fetch_hot_data,
            fetch_image_data_url
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
