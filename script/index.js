const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")    // promise of response
        .then((res) => res.json()) // promise of json data
        .then((json) => displayLesson(json.data));
};

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayLevelWord(data.data));
};

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
                <button class="btn btn-soft rounded-md bg-[#1A91FF1A] hover:bg-[#1A91FF80] border-none h-14 w-14"><i
                        class="fa-solid fa-circle-info"></i></button>
                <button class="btn btn-soft rounded-md bg-[#1A91FF1A] hover:bg-[#1A91FF80] border-none h-14 w-14"><i
                        class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `;

        wordContainer.append(card);
    });
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
        <button onClick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary">
        <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>
        `;

        // 4. append into container
        levelContainer.append(btnDiv);
    }
};

loadLessons();
