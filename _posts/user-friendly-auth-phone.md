---
title: "사용자 친화적인 휴대폰 번호 인증 만들기"
description: "휴대폰 인증을 구현하면서 사용자 편의성에 맞춰 고민한 것들을 적었습니다."
thumbnail: "/assets/blog/user-friendly-auth-phone/cover.png"
tags: ["JavaScript"]
createdAt: "2024-10-17 10:00:00"
category: "DEV"
---

이번에 사내에서 프로젝트를 진행하다가 휴대폰 번호 인증을 담당하게 됐습니다.
담당하게 됐을 때 NHN Cloud를 통해 SMS 서비스를 이용하고자 심사 중인 상황이었고 따로 구현되어 있는 것은 없었습니다.
심사를 마냥 기다릴 수 없어서 `setTimeout`과 `setInterval`함수를 활용하여 심사가 완료된 이후 비동기 함수만 넣으면 완료할 수 있도록 코드를 작성했습니다.

## 휴대폰 번호 입력

![휴대폰 번호 입력 input]("/assets/blog/user-friendly-auth-phone/1.png");

먼저 휴대폰 번호를 입력할 `input`과 인증 `button` 태그를 만들었습니다.

```js
function autoHyphenPhone(input) {
  let value = input.value.replace(/[^0-9]/g, "");
  if (value.length < 4) {
    input.value = value;
  } else if (value.length < 8) {
    input.value = value.slice(0, 3) + "-" + value.slice(3);
  } else {
    input.value =
      value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
  }
}
```

휴대폰 번호 `input`에는 공통 함수로 만들어 놓은 `autoHyphenPhone` 함수를 `onkeyup` 속성에 넣어줬습니다.
혹시나 사용자가 `-`을 입력할 경우를 대비하여 `placeholder`에 `하이픈 '-' 없이 입력해주세요.`라는 문구로 안내를 해줬습니다.

## 휴대폰 번호 인증

![휴대폰 인증 구간]("/assets/blog/user-friendly-auth-phone/2.png");

최근에 `Next.js`를 학습하면서 데이터 패칭이 되는 동안의 사용자 편의성에 대해서 생각하게 됐습니다.
`React`의 `Suspense` 태그를 이용할 수 있으면 좋겠지만 `JavaScript`를 사용중이기 때문에 아이디어만 착안했습니다.

```js
function sendSMS(e) {
  const button = e.target;
  const phone = document.querySelector("#user_phone");

  phone.disabled = true;

  button.innerHTML = `
    <div class="spinner-border spinner-border-sm text-scecondary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
 	`;
  button.removeEventListener("click", sendSMS);
}
```

전송 버튼을 누르면 사용자가 휴대폰 번호를 변경할 수 없도록 비활성화 시켜줍니다.
그리고 전송 버튼안에 `Loading` 상태를 표시해주는 UI가 버튼에 보여줌으로써 요청한 동작이 처리중이라는 것을 사용자에게 알려줍니다.
로딩중인 버튼을 클릭했을 때 중복 요청이 발생하지 않도록 이벤트 등록 함수를 지워줍니다.

## 휴대폰 번호 인증 문자 발송 후

![휴대폰 번호 인증 문자 발송 후]("/assets/blog/user-friendly-auth-phone/3.png");

```js
setTimeout(() => {
  button.innerHTML = `취소`;
  button.addEventListener("click", cancelSMS);

  container.style.display = "flex";
  startAuthTimer();
}, 3000);
```

`setTimeout` 함수 내부 내용은 심사가 끝나면 `ajax` 함수의 `success`에 작성될 내용입니다.
문자를 전송하는 처리가 완료되면 버튼의 내용을 취소로 바꾸고 취소 버튼에 이벤트 함수를 걸어줍니다.

`container`는 인증 번호를 입력하는 `input`과 `label` 태그를 묶는 `div` 태그입니다.
`display: none;`으로 했다가 인증 번호가 발송되면 `flex`로 바꿔 화면에 보여지도록 했습니다.

취소 버튼에 할당된 함수는 `container`를 다시 화면에 안 보이도록 하고 휴대폰 번호를 다시 입력할 수 있게 해줍니다.

```js
function startAuthTimer() {
  const authNumber = document.querySelector("#auth_number");
  const timer = document.querySelector("#auth_timer");
  const container = document.querySelector("#auth_container");
  authNumber.focus();
  timer.style.color = "#30BA43";
  authNumber.style.borderColor = "#30BA43";
  timer.textContent = "";
  let limitTime = 180;

  timerInterval = setInterval(() => {
    const min = Math.floor(limitTime / 69);
    const sec = limitTime % 60;

    timer.innerText = `\${String(min).padStart(2, '0')}:\${String(sec).padStart(2, '0')}`;

    if (limitTime <= 0) {
      clearInterval(timer);
      authNumber.style.borderColor = "#ff3e1d";
      timer.style.color = "#ff3e1d";
      timer.textContent = "시간이 초과됐습니다. 다시 시도해주세요.";

      authNumber.disalbed = true;
      clearInterval(timerInterval);
    }
    limitTime--;
  }, 1000);

  authNumber.addEventListener("keyup", (e) => {
    if (e.target.value === code) {
      clearInterval(timerInterval);
      document.querySelector("#send_sms_btn").disabled = true;
      document.querySelector("#send_sms_btn").innerHTML = "인증 완료";
      container.innerHTML = `
				<label class="col-sm-2 col-form-label" for=""></label>
				<div style="color: #30BA43;" class="col-sm-10">
					<p>인증됐습니다. 수정을 완료해주세요.</p>
				</div>
			`;
    }
  });
}
```

![인증 번호 입력 시간이 초과됐을 경우]("/assets/blog/user-friendly-auth-phone/4.png");

`startAuthTimer` 함수는 인증 번호를 입력할 수 있는 제한 시간을 나타내주는 함수입니다.
사용자가 인증 버튼을 누르고 인증 번호를 입력하기 위해 마우스로 클릭하는 행위를 자동으로 처리해주기 위해 `authNumber.focus();`를 사용했습니다.

인터벌 함수에서는 시간을 표시해주면서 만약 제한 시간이 지났을 경우 인증 번호 입력 태그를 비활성화 시키고 사용자에게 입력 시간이 초과했음을 알려줍니다.
명시적으로 표현해주기 위해 `borderColor`와 `color`를 바꿔줬습니다.
이렇게 설정한 색상은 `startAuthTimer`가 재시작 했을 때 다시 원래 색으로 초기화시켜줬습니다.

![인증 번호 입력 시간이 초과됐을 경우]("/assets/blog/user-friendly-auth-phone/5.png");

인터벌 함수를 실행시키고 인증 번호 입력창에 `keyup` 이벤트 리스너를 걸어줍니다.
입력한 인증 번호가 서버로 부터 받은 인증 번호와 일치할 경우 인터벌을 중지 시키고 `container`에 인증이 완료됐음을 알려주는 메세지를 띄워줍니다.

## 결과

![최종 결과물]("/assets/blog/user-friendly-auth-phone/6.gif");

완성된 최종 결과물입니다.
이제 NHN Cloud에서 승인이 나면 비동기 함수에 옮겨주기만 하면 원했던 기능이 구현될 것 같습니다.

## 코드 리팩토링

```js
function cancelSMS(e) {
  const button = e.target;
  const phone = document.querySelector("#user_phone");
  const container = document.querySelector("#auth_container");

  phone.disabled = false;

  button.innerHTML = "인증";
  button.removeEventListener("click", cancelSMS);
  button.addEventListener("click", sendSMS);

  container.style.display = "none";
}

function sendSMS(e) {
  const button = e.target;
  const phone = document.querySelector("#user_phone");
  const container = document.querySelector("#auth_container");

  phone.disabled = true;

  button.innerHTML = `
		<div class="spinner-border spinner-border-sm text-scecondary" role="status">
    	<span class="visually-hidden">Loading...</span>
  	</div>
 	`;
  button.removeEventListener("click", sendSMS);

  setTimeout(() => {
    button.innerHTML = `취소`;
    button.addEventListener("click", cancelSMS);

    container.style.display = "flex";
    startAuthTimer();
  }, 3000);
}

const code = "123123";
let timerInterval;

function startAuthTimer() {
  const authNumber = document.querySelector("#auth_number");
  const timer = document.querySelector("#auth_timer");
  const container = document.querySelector("#auth_container");
  authNumber.focus();
  timer.style.color = "#30BA43";
  authNumber.style.borderColor = "#30BA43";
  timer.textContent = "";
  let limitTime = 180;

  timerInterval = setInterval(() => {
    const min = Math.floor(limitTime / 69);
    const sec = limitTime % 60;

    timer.innerText = `\${String(min).padStart(2, '0')}:\${String(sec).padStart(2, '0')}`;

    if (limitTime <= 0) {
      clearInterval(timer);
      authNumber.style.borderColor = "#ff3e1d";
      timer.style.color = "#ff3e1d";
      timer.textContent = "시간이 초과됐습니다. 다시 시도해주세요.";

      authNumber.disabled = true;
      clearInterval(timerInterval);
    }
    limitTime--;
  }, 1000);

  authNumber.addEventListener("keyup", (e) => {
    if (e.target.value === code) {
      clearInterval(timerInterval);
      document.querySelector("#send_sms_btn").disabled = true;
      document.querySelector("#send_sms_btn").innerHTML = "인증 완료";
      container.innerHTML = `
				<label class="col-sm-2 col-form-label" for=""></label>
				<div style="color: #30BA43;" class="col-sm-10">
					<p>인증됐습니다. 수정을 완료해주세요.</p>
				</div>
			`;
    }
  });
}

document.addEventListener("DOMContentLoaded", (e) => {
  document.querySelector("#send_sms_btn").addEventListener("click", sendSMS);
});
```

기능 구현을 위해 생각나는 대로 코드를 짰기 때문에 코드의 역할이 분리되어 있지 않았습니다.
원하는 기능을 얻었으니 코드를 정리해보도록 하겠습니다.

### 유틸리티 함수 생성 및 이벤트 리스너 제거 개선

먼저 중복되는 작업을 함수로 묶어서 간결하게 표현하도록 하겠습니다.
제가 생각하기에 가장 많이 중복되는 작업은 버튼 태그를 변경하는 작업인 것 같습니다.

```js
// 버튼을 초기화 해주는 함수
function setButton(button, innerHTML, clickHandler) {
  button.innerHTML = innerHTML;
  button.replaceWith(button.cloneNode(true));
  button = document.querySelector("#send_sms_btn");
  button.addEventListener("click", clickHandler);
}
```

버튼을 초기화하는 함수에서 주목할 점은 기존에 `removeEventListener` 메서드를 사용하는 대신에 `replaceWith` 메서드와 `cloneNode`를 사용한 점입니다.

한 요소에 `addEventListener`와 `removeEventListener`를 반복적으로 사용하다보면 자칫 리스너가 누적되어 오류가 발생할 수도 있습니다. `cloneNode`를 사용하면 기존 요소를 복사하면서 이벤트 리스너가 제거됩니다. 이후 `replaceWith`로 새 요소를 기존 요소와 교체함으로써 이벤트 리스너만 다시 등록하도록 했습니다.

이렇게 코드를 변경하면 중복 이벤트 리스너가 등록되는 것이 방지되어 안정성과 기존 리스너를 일일히 지우는 대신 복사를 함으로써 단순하게 사용할 수 있는 장점이 있습니다.

```js
// 요소를 비활성화 하는 함수
function setDisabled(element, isDisabled) {
  element.disabled = isDisabled;
}
```

추가로 요소를 비활성화 하는 함수도 따로 만들어줬습니다.
모든 요소에 사용할 수 있기 때문에 공통 함수 파일에 작성했습니다.

```js
// 인증 취소 함수
function cancelSMS() {
  const phone = document.querySelector("#user_phone");
  const container = document.querySelector("#auth_container");

  setDisabled(phone, false);

  setButton(document.querySelector("#send_sms_btn"), "인증", sendSMS);
  container.style.display = "none";
}

// 인증 문자를 보내는 함수
function sendSMS() {
  const phone = document.querySelector("#user_phone");
  const container = document.querySelector("#auth_container");

  setDisabled(phone, true);

  const innerHTML = `
		<div class="spinner-border spinner-border-sm text-scecondary" role="status">
    	<span class="visually-hidden">Loading...</span>
  	</div>
 	`;
  setButton(document.querySelector("#send_sms_btn"), innerHTML, null);

  setTimeout(() => {
    setButton(document.querySelector("#send_sms_btn"), "취소", cancelSMS);
    container.style.display = "flex";
    startAuthTimer();
  }, 3000);
}
```

`setButton` 함수를 사용하여 코드가 조금은 간결해졌습니다.
기존에는 `button` 변수에 `e.target`을 할당했지만 선택자로 선택하도록 변경했습니다.
이유는 `replaceWith` 메서드로 인해 기존 버튼이 DOM에서 삭제되기 때문입니다.
`replaceWith`을 사용하면 이전 버튼은 더이상 유효하지 않게 됨으로 복제된 새 버튼에 접근하기 위해서 선택자로 다시 한 번 선택해줘야 합니다.

### 타이머 관리 개선 및 로직 분리

```js
// 타이머 관리하는 함수
const timerManager = (() => {
  let timerInterval = null;
  return {
    set: (interval) => {
      timerInterval = interval;
    },
    clear: (timerInterval) => {
      clearInterval(timerInterval);
      timerInterval = null;
    },
  };
})();
```

기존에 전역 변수로 관리되던 타이머를 클로저로 관리하여 전역 상태를 피했습니다.
클로저를 사용하면 `timerInterval` 변수를 캡슐화시킬 수 있습니다.
또한 전역 변수를 많이 사용하면 이름 충돌이 날 수 있기 때문에 안정성을 높일 수 있습니다.

```js
// 인증 타이머를 실행시키는 함수
function startAuthTimer() {
  const authNumber = document.querySelector("#auth_number");
  const timer = document.querySelector("#auth_timer");
  const container = document.querySelector("#auth_container");
  authNumber.focus();
  timer.style.color = "#30BA43";
  authNumber.style.borderColor = "#30BA43";
  timer.textContent = "";
  let limitTime = 180;

  const interval = setInterval(() => {
    const min = Math.floor(limitTime / 69);
    const sec = limitTime % 60;
    timer.innerText = `\${String(min).padStart(2, '0')}:\${String(sec).padStart(2, '0')}`;

    if (limitTime <= 0) {
      timerManager.clear();
      authNumber.style.borderColor = "#ff3e1d";
      timer.style.color = "#ff3e1d";
      timer.textContent = "시간이 초과됐습니다. 다시 시도해주세요.";
      setDisabled(authNumber, true);
    }
    limitTime--;
  }, 1000);

  timerManager.set(interval);
  authNumber.addEventListener("keyup", handleAuthInput);
}

// 인증 번호 입력 핸들링 함수
function handleAuthInput(e) {
  const code = "123123";
  if (e.target.value === code) {
    clearInterval(timerInterval);
    const button = document.getElementById("send_sms_btn");
    setDisabled(button, true);
    button.innerHTML = "인증 완료";
    container.innerHTML = `
			<label class="col-sm-2 col-form-label" for=""></label>
			<div style="color: #30BA43;" class="col-sm-10">
				<p>인증됐습니다. 수정을 완료해주세요.</p>
			</div>
		`;
  }
}
```

기존의 `startAuthTimer` 함수는 타이머를 실행 시키고 인증 번호 입력 핸들링을 모두 처리하고 있었기 때문에 로직을 분리하여 각 함수가 고유한 책임을 가지도록 수정했습니다.

### 최종 코드

```js
// 요소를 비활성화 하는 함수
function setDisabled(element, isDisabled) {
  element.disabled = isDisabled;
}

// 버튼을 초기화 해주는 함수
function setButton(button, innerHTML, clickHandler) {
  button.innerHTML = innerHTML;
  button.replaceWith(button.cloneNode(true));
  button = document.querySelector("#send_sms_btn");
  button.addEventListener("click", clickHandler);
}

// 타이머 관리하는 함수
const timerManager = (() => {
  let timerInterval = null;
  return {
    set: (interval) => {
      timerInterval = interval;
    },
    clear: (timerInterval) => {
      clearInterval(timerInterval);
      timerInterval = null;
    },
  };
})();

// 인증 취소 함수
function cancelSMS() {
  const phone = document.querySelector("#user_phone");
  const container = document.querySelector("#auth_container");

  setDisabled(phone, false);

  setButton(document.querySelector("#send_sms_btn"), "인증", sendSMS);
  container.style.display = "none";
}

// 인증 문자를 보내는 함수
function sendSMS() {
  const phone = document.querySelector("#user_phone");
  const container = document.querySelector("#auth_container");

  setDisabled(phone, true);

  const innerHTML = `
		<div class="spinner-border spinner-border-sm text-scecondary" role="status">
    	<span class="visually-hidden">Loading...</span>
  	</div>
 	`;
  setButton(document.querySelector("#send_sms_btn"), innerHTML, null);

  setTimeout(() => {
    setButton(document.querySelector("#send_sms_btn"), "취소", cancelSMS);
    container.style.display = "flex";
    startAuthTimer();
  }, 3000);
}

// 인증 타이머를 실행시키는 함수
function startAuthTimer() {
  const authNumber = document.querySelector("#auth_number");
  const timer = document.querySelector("#auth_timer");
  const container = document.querySelector("#auth_container");
  authNumber.focus();
  timer.style.color = "#30BA43";
  authNumber.style.borderColor = "#30BA43";
  timer.textContent = "";
  let limitTime = 180;

  const interval = setInterval(() => {
    const min = Math.floor(limitTime / 69);
    const sec = limitTime % 60;
    timer.innerText = `\${String(min).padStart(2, '0')}:\${String(sec).padStart(2, '0')}`;

    if (limitTime <= 0) {
      timerManager.clear();
      authNumber.style.borderColor = "#ff3e1d";
      timer.style.color = "#ff3e1d";
      timer.textContent = "시간이 초과됐습니다. 다시 시도해주세요.";
      setDisabled(authNumber, true);
    }
    limitTime--;
  }, 1000);

  timerManager.set(interval);
  authNumber.addEventListener("keyup", handleAuthInput);
}

// 인증 번호 일치 여부를 검사하는 함수
function handleAuthInput(e) {
  const code = "123123";
  if (e.target.value === code) {
    clearInterval(timerInterval);
    const button = document.getElementById("send_sms_btn");
    setDisabled(button, true);
    button.innerHTML = "인증 완료";
    container.innerHTML = `
			<label class="col-sm-2 col-form-label" for=""></label>
			<div style="color: #30BA43;" class="col-sm-10">
				<p>인증됐습니다. 수정을 완료해주세요.</p>
			</div>
		`;
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  document.querySelector("#send_sms_btn").addEventListener("click", sendSMS);
});
```

코드량이 줄어들지는 않았지만 로직이 분리되고 안정성이 조금은 높아진 느낌입니다.
혹시라도 더 개선해야 할 점이 있으면 댓글로 알려주세요! ㅎㅎ
