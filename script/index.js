const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn bg-[#EDF7FF] rounded-md mr-4">${el}</span>`);
    return htmlElements.join(" ");
};

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")    // promise of response
        .then((res) => res.json()) // promise of json data
        .then((json) => displayLesson(json.data));
};

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach(btn => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive();         // remove all active class
            const clickbtn = document.getElementById(`lesson-btn-${id}`);
            clickbtn.classList.add("active");       // add active class
            displayLevelWord(data.data);
        });
};



// {
// "word": "Eager",
// "meaning": "আগ্রহী",
// "pronunciation": "ইগার",
// "level": 1,
// "sentence": "The kids were eager to open their gifts.",
// "points": 1,
// "partsOfSpeech": "adjective",
// "synonyms": [
// "enthusiastic",
// "excited",
// "keen"
// ],
// "id": 5
// }



const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}

const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
                    <div class="space-y-2">
                    <h2 class="text-4xl font-semibold">
                        ${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})
                    </h2>
                </div>
                <div class="space-y-2">
                    <h2 class="text-2xl font-semibold">
                        Meaning
                    </h2>
                    <p class="text-2xl font-medium font-bangla">${word.meaning}</p>
                </div>
                <div class="space-y-2">
                    <h2 class="text-2xl font-semibold">
                        Example
                    </h2>
                    <p class="text-2xl font-medium">${word.sentence}</p>
                </div>
                <div class="space-y-2">
                    <h2 class="text-2xl font-semibold font-bangla">
                        সমার্থক শব্দ গুলো
                    </h2>
                    <div class="">
                    ${createElements(word.synonyms)}
                    </div>
                </div>
    `;
    document.getElementById("word_modal").showModal();
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="font-bangla text-center col-span-full space-y-4 py-16">
            <img class="mx-auto" src="./assets/alert-error.png" alt="">
            <p class="text-[13px] text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h1 class="text-[34px] font-medium text-[#292524]">নেক্সট Lesson এ যান</h1>
        </div>
        `;
        manageSpinner(false);
        return;
    }

    //     {
    //     "id": 82,
    //     "level": 1,
    //     "word": "Car",
    //     "meaning": "গাড়ি",
    //     "pronunciation": "কার"
    // }

    words.forEach(word => {
        const card = document.createElement("div");
        // <!-- card -->
        card.innerHTML = `
        <div class="h-full bg-white rounded-xl shadow-sm text-center py-14 px-14 space-y-4">
            <h2 class="text-[32px] font-bold text-black">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="text-xl font-medium">Meaning / Pronunciation</p>
            <div class="font-bangla text-[32px] font-semibold">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn btn-soft rounded-md bg-[#1A91FF1A] hover:bg-[#1A91FF80] border-none h-14 w-14"><i
                        class="fa-solid fa-circle-info"></i></button>
                <button onClick="pronounceWord('${word.word}')" class="btn btn-soft rounded-md bg-[#1A91FF1A] hover:bg-[#1A91FF80] border-none h-14 w-14"><i
                        class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `;

        wordContainer.append(card);
    });
    manageSpinner(false);
};

const displayLesson = (lessons) => {
    // 1. get the container & empty
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    // 2. get into every lessons
    for (let lesson of lessons) {

        // 3. create Element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id = "lesson-btn-${lesson.level_no}" onClick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>
        `;

        // 4. append into container
        levelContainer.append(btnDiv);
    }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();

    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue)
            );
            displayLevelWord(filterWords);
        });
});
