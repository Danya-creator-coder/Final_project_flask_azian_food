document.addEventListener("DOMContentLoaded", () => {
  // Обработчики для модальных окон (оставляем как есть)
  document.getElementById("registerButton")?.addEventListener("click", () => {
    document.getElementById("registerModal").classList.remove("hidden", "scale-0");
  });

  document.getElementById("closeRegister")?.addEventListener("click", () => {
    document.getElementById("registerModal").classList.add("hidden", "scale-0");
  });

  document.getElementById("closeLogin")?.addEventListener("click", () => {
    document.getElementById("loginModal").classList.add("hidden", "scale-0");
  });

  document.getElementById("openLogin")?.addEventListener("click", () => {
    document.getElementById("registerModal").classList.add("hidden", "scale-0");
    document.getElementById("loginModal").classList.remove("hidden", "scale-0");
  });

  document.getElementById("openRegister")?.addEventListener("click", () => {
    document.getElementById("loginModal").classList.add("hidden", "scale-0");
    document.getElementById("registerModal").classList.remove("hidden", "scale-0");
  });

  // Обработка телефонного номера
  const phoneContainer = document.getElementById("phoneContainer");
  const phonePlaceholder = document.getElementById("phonePlaceholder");
  const phoneInput = document.getElementById("phoneInput");

  if (phonePlaceholder && phoneInput) {
    phonePlaceholder.addEventListener("click", () => {
      phonePlaceholder.classList.add("hidden");
      phoneInput.classList.remove("hidden");
      phoneInput.focus();
      phoneInput.value = "+380 ";
    });

    phoneInput.addEventListener("input", () => {
      let numbers = phoneInput.value.replace(/\D/g, "");
      if (numbers.startsWith("380")) {
        numbers = numbers.slice(3);
      }

      let formattedNumber = "+380 ";

      if (numbers.length > 0) formattedNumber += `(${numbers.slice(0, 2)}`;
      if (numbers.length >= 2) formattedNumber += `) ${numbers.slice(2, 5)}`;
      if (numbers.length >= 5) formattedNumber += ` ${numbers.slice(5, 7)}`;
      if (numbers.length >= 7) formattedNumber += ` ${numbers.slice(7, 9)}`;

      phoneInput.value = formattedNumber.trim();
    });

    phoneInput.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && phoneInput.value.length <= 5) {
        event.preventDefault();
      }
    });

    phoneInput.addEventListener("blur", () => {
      if (phoneInput.value === "+380 " || phoneInput.value === "") {
        phoneInput.classList.add("hidden");
        phonePlaceholder.classList.remove("hidden");
      }
    });
  }

  // ВАЖНО: Обработка отправки формы регистрации через AJAX
  const registerForm = document.querySelector("#registerModal form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Предотвращаем стандартную отправку формы

      // Собираем данные формы
      const formData = new FormData(this);
      const userData = {
        username: formData.get("username"),
        phone: formData.get("phone"),
        password: formData.get("password"),
      };

      // Отправляем данные на сервер через fetch API
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Если успешно, обновляем UI для авторизованного пользователя
            updateAuthUI(true);

            // Закрываем модальное окно регистрации
            document.getElementById("registerModal").classList.add("hidden", "scale-0");

            // Показываем сообщение об успешной регистрации и автоматическом входе
            alert("Регистрация успешна! Вы автоматически вошли в систему.");

            // Перенаправляем на главную страницу
            window.location.href = data.redirect;
          } else {
            // Если ошибка, показываем сообщение
            alert(data.message || "Ошибка при регистрации");
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert("Произошла ошибка при отправке формы");
        });
    });
  }

  // Обработка отправки формы входа через AJAX
  const loginForm = document.querySelector("#loginModal form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const userData = {
        username: formData.get("username"),
        password: formData.get("password"),
      };

      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Обновляем UI после успешного входа
            updateAuthUI(true);

            // Закрываем модальное окно
            document.getElementById("loginModal").classList.add("hidden", "scale-0");

            // Показываем сообщение об успешном входе
            alert("Вход выполнен успешно!");

            // Перенаправляем на главную страницу
            window.location.href = data.redirect;
          } else {
            alert(data.message || "Ошибка при входе");
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert("Произошла ошибка при отправке формы");
        });
    });
  }

  // Обработка отправки формы загрузки аватара через AJAX
  const avatarForm = document.querySelector("#avatarForm");
  if (avatarForm) {
    avatarForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Предотвращаем стандартную отправку формы

      const formData = new FormData(this);

      fetch("/upload_avatar", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            // Обновляем аватар на странице
            document.querySelector("img[alt='Profile']").src = "/static/uploads/avatar.png?t=" + new Date().getTime();
            alert("Аватар успешно загружен!");
          } else {
            return response.json().then(data => {
              alert(data.message || "Ошибка при загрузке аватара.");
            });
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert("Произошла ошибка при отправке формы");
        });
    });
  }

  // Обработчик для открытия модального окна загрузки аватара
  const avatarContainer = document.getElementById("avatarContainer");
  const uploadAvatarModal = document.getElementById("uploadAvatarModal");
  const closeUploadAvatar = document.getElementById("closeUploadAvatar");

  avatarContainer.addEventListener("click", () => {
    uploadAvatarModal.classList.remove("hidden", "scale-0");
  });

  closeUploadAvatar.addEventListener("click", () => {
    uploadAvatarModal.classList.add("hidden", "scale-0");
  });
});

// Обновленная функция для обновления интерфейса после входа/выхода
function updateAuthUI(isLoggedIn) {
  const authElement = document.querySelector("nav ul li:first-child a");
  if (!authElement) return;

  if (isLoggedIn) {
    authElement.innerHTML = `
      <span class="material-icons text-yellow-500">logout</span>
      LOG OUT
    `;
    authElement.href = "/logout";

    // Добавляем аватар пользователя рядом с названием ресторана
    const logoElement = document.querySelector("a.text-3xl.font-bold");
    if (logoElement && !document.querySelector(".w-10.h-10.rounded-full")) {
      const parentDiv = logoElement.parentElement;

      // Создаем новый div с аватаром и логотипом
      const newDiv = document.createElement("div");
      newDiv.className = "flex items-center gap-3";

      const avatarDiv = document.createElement("div");
      avatarDiv.className = "w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center";

      const avatarImg = document.createElement("img");
      avatarImg.src = "/static/uploads/avatar.png"; // Изменено на путь к загруженному аватару
      avatarImg.alt = "Profile";
      avatarImg.className = "w-full h-full object-cover";

      avatarDiv.appendChild(avatarImg);
      newDiv.appendChild(avatarDiv);
      newDiv.appendChild(logoElement.cloneNode(true));

      // Заменяем логотип на новый div с аватаром и логотипом
      parentDiv.replaceChild(newDiv, logoElement);
    }
  } else {
    authElement.innerHTML = `
      <span class="material-icons text-yellow-500">login</span>
      SIGN UP
    `;
    authElement.id = "registerButton";
    authElement.href = "#";

    // Удаляем аватар пользователя, если он есть
    const avatarContainer = document.querySelector(".flex.items-center.gap-3");
    if (avatarContainer) {
      const parentDiv = avatarContainer.parentElement;
      const logoElement = avatarContainer.querySelector("a.text-3xl.font-bold");

      if (logoElement && parentDiv) {
        parentDiv.replaceChild(logoElement.cloneNode(true), avatarContainer);
      }
    }

    // Добавляем обработчик для кнопки регистрации
    authElement.addEventListener("click", () => {
      document.getElementById("registerModal").classList.remove("hidden", "scale-0");
    });
  }
}

// Проверяем статус авторизации при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  // Проверяем, есть ли в DOM элемент с id logoutButton или текст LOG OUT
  const authElement = document.querySelector("nav ul li:first-child a");
  if (authElement && authElement.textContent.includes("LOG OUT")) {
    // Если есть, значит пользователь авторизован
    updateAuthUI(true);
  }
});