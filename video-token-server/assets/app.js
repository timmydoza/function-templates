function updateCurlCommandTextBox(kind, passcode) {
  let text;
  switch (kind) {
    case 'linux':
      text = `curl -X POST ${window.location.origin}/token \\
  --data-urlencode "passcode=${passcode || ''}” \\
  --data-urlencode "identity=user” \\
  --data-urlencode “room=cool room”`;
      break;
    case 'windows-curl':
      text = 'TODO: windows-curl';
      break;
    case 'windows-powershell':
      text = 'TODO: windows-powershell';
      break;
  }
  const textarea = document.getElementById('curl-commands');
  textarea.value = text;
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function updateEnvTextBox(passcode) {
  let text = `TWILIO_TOKEN_BASE_URL=${window.location.origin}
TWILIO_TOKEN_PASSCODE=${passcode || ''}`;

  const textarea = document.getElementById('env-file');
  textarea.value = text;
}

// from ce-helpers.js
inputPrependBaseURL();
handleCopyToClipboard();

document.querySelector('.tabs').addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    document
      .querySelectorAll('.tabs button')
      .forEach((el) => el.classList.remove('active'));
    e.target.classList.add('active');
    updateCurlCommandTextBox(e.target.dataset.tab);
  }
});

document.querySelectorAll('.copy-textarea-wrapper .copy-button').forEach((el) =>
  el.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(el.parentElement.querySelector('textarea').value)
      .then(() => {
        el.classList.add('copied');
      })
      .catch(() => console.error('Error copying text to clipboard'));
  })
);

// The /initialize route requires this parameter so plain GET requests can't trigger an initialization
fetch('/initialize?initialize=true')
  .then((res) => res.json())
  .then((res) => {
    if (res.passcode) {
      document.getElementById('passcode-generated').style.display = 'block';
      updateCurlCommandTextBox('linux', res.passcode);
      updateEnvTextBox(res.passcode);
      document.getElementById('token-server-passcode').value = res.passcode;
    } else {
      document.getElementById('passcode-already-generated').style.display =
        'block';
      updateCurlCommandTextBox('linux');
      updateEnvTextBox();
    }
  })
  .catch((e) => {
    console.error('Error initializing token server:', e);
    document.getElementById('passcode-already-generated').style.display =
      'block';
    updateCurlCommandTextBox('linux');
    updateEnvTextBox();
  });
