const form = document.querySelector("#form");
const input = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const clearButton = document.querySelector("#clearButton");
const imagelistWrapper = document.querySelector(".imagelist-wrapper");
const searchStatus = document.querySelector("#searchStatus");

runEventListeners();

function runEventListeners() {
  form.addEventListener("submit", search);
  clearButton.addEventListener("click", clear);
}

function clear() {
  input.value = "";
  imagelistWrapper.replaceChildren();
  searchStatus.textContent = "";
  input.focus();
}

async function search(e) {
  e.preventDefault();
  const value = input.value.trim();

  if (!value) {
    imagelistWrapper.replaceChildren();
    searchStatus.textContent = "Aramak için bir kelime yazın.";
    input.focus();
    return;
  }

  searchButton.disabled = true;
  clearButton.disabled = true;
  imagelistWrapper.replaceChildren();
  searchStatus.textContent = "Görseller aranıyor...";

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(value)}`,
      {
        method: "GET",
        headers: {
          Authorization: "Client-ID xEdG_y0HE3QWv7L0LU9ed9EaeVXd5-dHNtz4K8PLo2Y",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Görseller alınamadı (HTTP ${response.status}).`);
    }

    const data = await response.json();
    const images = Array.isArray(data.results) ? data.results : [];
    let displayedImages = 0;
    images.forEach((image) => {
      if (image?.urls?.small) {
        addImageToUI(image.urls.small, image.alt_description || value);
        displayedImages += 1;
      }
    });

    searchStatus.textContent = displayedImages
      ? `${displayedImages} görsel bulundu.`
      : "Bu arama için görsel bulunamadı.";
  } catch (error) {
    console.error("Görsel araması başarısız oldu:", error);
    searchStatus.textContent =
      "Görseller yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.";
  } finally {
    searchButton.disabled = false;
    clearButton.disabled = false;
  }
}

function addImageToUI(url, description) {
  const div = document.createElement("div");
  div.className = "card";

  const img = document.createElement("img");
  img.src = url;
  img.alt = description;
  img.loading = "lazy";

  div.append(img);
  imagelistWrapper.append(div);
}
