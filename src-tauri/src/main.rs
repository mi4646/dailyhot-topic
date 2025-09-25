// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::{Client, header::{ HeaderMap,HeaderValue, REFERER, CONTENT_TYPE}};
use base64::{engine::general_purpose, Engine as _};
use std::time::Duration;

#[tauri::command]
async fn fetch_hot_data(name: String) -> Result<String, String> {
    // 构建所有平台的多源 URL 列表，统一返回 Vec<String>
    let urls: Vec<String> = match name.as_str() {
        "douyin" => vec![
            "https://api-hot.imsyy.top/douyin?cache=true",
            "https://news.zpa666.top/api/douyin?cache=true",
            "https://60s.viki.moe/v2/douyin",
        ],
        "weibo" => vec![
            "https://api-hot.imsyy.top/weibo?cache=true",
            "https://news.zpa666.top/api/weibo?cache=true",
            "https://60s.viki.moe/v2/weibo",
        ],
        "baidu" => vec![
            "https://api-hot.imsyy.top/baidu?cache=true",
            "https://news.zpa666.top/api/baidu?cache=true",
            "https://60s.viki.moe/v2/baidu/hot",
        ],
        "toutiao" => vec![
            "https://api-hot.imsyy.top/toutiao?cache=true",
            "https://news.zpa666.top/api/toutiao?cache=true",
            "https://60s.viki.moe/v2/toutiao",
        ],
        "juejin" => vec![
            "https://api-hot.imsyy.top/juejin?cache=true",
            "https://news.zpa666.top/api/juejin?cache=true",
        ],
        "qq-news" => vec![
            "https://api-hot.imsyy.top/qq-news?cache=true",
            "https://news.zpa666.top/api/qq-news?cache=true",
        ],
        "netease-news" => vec![
            "https://api-hot.imsyy.top/netease-news?cache=true",
            "https://news.zpa666.top/api/netease-news?cache=true",
        ],
        "36kr" => vec![
            "https://api-hot.imsyy.top/36kr?cache=true",
            "https://news.zpa666.top/api/36kr?cache=true",
        ],
        "sspai" => vec![
            "https://api-hot.imsyy.top/sspai?cache=true",
            "https://news.zpa666.top/api/sspai?cache=true",
        ],
        "ithome" => vec![
            "https://api-hot.imsyy.top/ithome?cache=true",
            "https://news.zpa666.top/api/ithome?cache=true",
        ],
        "tieba" => vec![
            "https://api-hot.imsyy.top/tieba?cache=true",
            "https://news.zpa666.top/api/tieba?cache=true",
        ],
        "genshin" => vec![
            "https://api-hot.imsyy.top/genshin?cache=true",
            "https://news.zpa666.top/api/genshin?cache=true",
        ],
        "starrail" => vec![
            "https://api-hot.imsyy.top/starrail?cache=true",
            "https://news.zpa666.top/api/starrail?cache=true",
        ],
        "lol" => vec![
            "https://api-hot.imsyy.top/lol?cache=true",
            "https://news.zpa666.top/api/lol?cache=true",
        ],
        "weread" => vec![
            "https://api-hot.imsyy.top/weread?cache=true",
            "https://news.zpa666.top/api/weread?cache=true",
        ],
        "zhihu-daily" => vec![
            "https://api-hot.imsyy.top/zhihu-daily?cache=true",
            "https://news.zpa666.top/api/zhihu-daily?cache=true",
        ],
        "ngabbs" => vec![
            "https://api-hot.imsyy.top/ngabbs?cache=true",
            "https://news.zpa666.top/api/ngabbs?cache=true",
        ],
        "jianshu" => vec![
            "https://api-hot.imsyy.top/jianshu?cache=true",
            "https://news.zpa666.top/api/jianshu?cache=true",
        ],
        "hellogithub" => vec![
            "https://api-hot.imsyy.top/hellogithub?cache=true",
            "https://news.zpa666.top/api/hellogithub?cache=true",
        ],
        "thepaper" => vec![
            "https://api-hot.imsyy.top/thepaper?cache=true",
            "https://news.zpa666.top/api/thepaper?cache=true",
        ],
        "sina-news" => vec![
            "https://news.zpa666.top/api/sina-news?cache=true",
        ],
        "csdn" => vec![
            "https://news.zpa666.top/api/csdn?cache=true",
        ],
        "coolapk" => vec![
            "https://news.zpa666.top/api/coolapk?cache=true",
        ],
        "smzdm" => vec![
            "https://news.zpa666.top/api/smzdm?cache=true",
        ],
        "guokr" => vec![
            "https://news.zpa666.top/api/guokr?cache=true",
        ],
        "dongchedi" => vec![
            "https://60s.viki.moe/v2/dongchedi",
        ],
        "rednote" => vec![
            "https://60s.viki.moe/v2/rednote",
        ],
        "bilibili" => vec![
            "https://60s.viki.moe/v2/bili",
        ],
        "v2ex" => vec![
            "https://www.v2ex.com/api/topics/hot.json",
        ],
        "github" => vec![
            "https://trend.doforce.dpdns.org/repo",
        ],
        "zhihu" => vec![
            "https://api.zhihu.com/topstory/hot-lists/total?limit=10&reverse_order=0",
        ],
        "xinwenlianbo" => vec![
            "https://api.cntv.cn/NewVideo/getVideoListByColumn?id=TOPC1451528971114112&n=10&sort=desc&p=1&mode=0&serviceId=tvcctv",
        ],
        "douban-movie" => vec![
            "https://m.douban.com/rexxar/api/v2/subject_collection/movie_real_time_hotest/items?type=movie&start=0&count=10&for_mobile=1",
        ],
        _ => {
            // 通用 fallback（适用于未列出的平台）
            return Err("不支持该平台".to_string());
        }
    }.into_iter().map(|s| s.trim().to_string()).collect(); // 统一处理前后空格

    let client = Client::builder()
        .timeout(Duration::from_secs(10))
        .build()
        .map_err(|e| format!("客户端构建失败: {}", e))?;

    for url in &urls {
        println!("📡 尝试请求 {} -> {}", name, url);

        match make_request(&client, &name, url).await {
            Ok(data) => {
                println!("✅ 成功从 {} 获取数据", url);
                return Ok(data);
            }
            Err(e) => {
                let msg = if e.contains("timed out") {
                    "请求超时"
                } else if e.starts_with("HTTP ") {
                    &e
                } else {
                    "网络错误"
                };
                println!("❌ 请求失败 {} ({}): {}", url, name, msg);
                continue;
            }
        }
    }

    Err(format!("所有 API 均请求失败: {}", name))
}

// 单独封装请求逻辑
async fn make_request(client: &Client, name: &str, url: &str) -> Result<String, String> {
    let response = if name == "douban-movie" {
        let mut headers = HeaderMap::new();
        headers.insert(
            REFERER,
            HeaderValue::from_static("https://m.douban.com/"),
        );
        client.get(url).headers(headers).send().await
    } else {
        client.get(url).send().await
    };

    let response = response.map_err(|e| e.to_string())?;

    // 检查 Content-Type 是否为 JSON
    let content_type = response.headers().get(CONTENT_TYPE);
    if let Some(ct) = content_type {
        let ct_str = ct.to_str().unwrap_or("");
        if !ct_str.contains("application/json") && !ct_str.contains("text/plain") {
            return Err("非 JSON 响应类型".to_string());
        }
    }

    let text = response.text().await.map_err(|e| e.to_string())?;

    // 检测是否为 HTML 或 V2EX 登录页
    if text.trim().starts_with("<") || text.contains("你要查看的页面需要先登录") {
        return Err("检测到 HTML 或登录页".to_string());
    }

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
