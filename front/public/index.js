if (document.location.search.includes('dark-theme=true')) {
  document.body.classList.add('dark-theme');
}

let cursor = 0;
const RANGE = 5;
const LIMIT = 16_000;

const textToImage = async (text) => {
  const inferenceResponse = await fetch(`infer_biggan?input=${text}`);
  const inferenceBlob = await inferenceResponse.blob();

  return URL.createObjectURL(inferenceBlob);
};

const translateText = async (text) => {
  const inferResponse = await fetch(`infer_t5?input=${text}`);
  const inferJson = await inferResponse.json();

  return inferJson.output;
};

const queryDataset = async (start, end) => {
  const queryResponse = await fetch(`query_emotion?start=${start}&end=${end}`);
  const queryJson = await queryResponse.json();

  return queryJson.output;
};

const updateTable = async (cursor, range = RANGE) => {
  const table = document.querySelector('.dataset-output');

  const fragment = new DocumentFragment();

  const observations = await queryDataset(cursor, cursor + range);

  for (const observation of observations) {
    let row = document.createElement('tr');
    let text = document.createElement('td');
    let emotion = document.createElement('td');

    text.textContent = observation.text;
    emotion.textContent = observation.emotion;

    row.appendChild(text);
    row.appendChild(emotion);
    fragment.appendChild(row);
  }

  table.innerHTML = '';

  table.appendChild(fragment);

  table.insertAdjacentHTML(
    'afterbegin',
    `<thead>
      <tr>
        <td>text</td>
        <td>emotion</td>
      </tr>
    </thead>`
  );
};

const imageGenSelect = document.getElementById('image-gen-input');
const imageGenImage = document.querySelector('.image-gen-output');
const textGenForm = document.querySelector('.text-gen-form');
const tableButtonPrev = document.querySelector('.table-previous');
const tableButtonNext = document.querySelector('.table-next');

imageGenSelect.addEventListener('change', async (event) => {
  const value = event.target.value;

  try {
    imageGenImage.src = await textToImage(value);
    imageGenImage.alt = value + ' generated from BigGAN AI model';
  } catch (err) {
    console.error(err);
  }
});

textGenForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const textGenInput = document.getElementById('text-gen-input');
  const textGenParagraph = document.querySelector('.text-gen-output');

  try {
    textGenParagraph.textContent = await translateText(textGenInput.value);
  } catch (err) {
    console.error(err);
  }
});

tableButtonPrev.addEventListener('click', () => {
  cursor = cursor > RANGE ? cursor - RANGE : 0;

  if (cursor < RANGE) {
    tableButtonPrev.classList.add('hidden');
  }
  if (cursor < LIMIT - RANGE) {
    tableButtonNext.classList.remove('hidden');
  }

  updateTable(cursor);
});

tableButtonNext.addEventListener('click', () => {
  cursor = cursor < LIMIT - RANGE ? cursor + RANGE : cursor;

  if (cursor >= RANGE) {
    tableButtonPrev.classList.remove('hidden');
  }
  if (cursor >= LIMIT - RANGE) {
    tableButtonNext.classList.add('hidden');
  }

  updateTable(cursor);
});

textToImage(imageGenSelect.value)
  .then((image) => (imageGenImage.src = image))
  .catch(console.error);

updateTable(cursor)
  .catch(console.error);
