let filterList = []
const allTags = []

async function getData() {
    const requestURL = './data.json';
    const request = new Request(requestURL);

    const response = await fetch(request);
    const allJobs = await response.json();

    return allJobs
}
async function populateJobs(){
    const allJobs = await getData()
    allJobs.forEach(element => {
        createJob(element)
    });
}
populateJobs()

function createJob(job){
    const main = document.querySelector("main")

    const jobContainer = document.createElement("div")
    jobContainer.classList.add("job")

    //section 1
    const logo = document.createElement("img")
    logo.src = job.logo
    
    //section 2
        //section 2 - top
    const companyName = document.createElement("h2")
    companyName.innerText = job.company
    const infoContainer = document.createElement("div")
    const topRow = document.createElement("div")
    topRow.classList.add("top-row")
    topRow.append(companyName)
    if(job.new){
        const newTag = document.createElement("p")
        newTag.innerText = "NEW!"
        newTag.classList.add("new-tag")
        topRow.append(newTag)
        jobContainer.classList.add("NEW!")
        addFilter(newTag)
    }
    if(job.featured){
        const featuredTag = document.createElement("p")
        featuredTag.innerText = "FEATURED"
        featuredTag.classList.add("featured-tag")
        topRow.append(featuredTag)
        jobContainer.classList.add("FEATURED")
        addFilter(featuredTag)
    }
        //section 2 - mid
    const midRow = document.createElement("div")
    midRow.classList.add("mid-row")
    midRow.innerText = job.position
        //section 2 - bottom
    const postedAt = document.createElement("p"), 
        contract = document.createElement("p"),
        location = document.createElement("p")
    postedAt.innerText = job.postedAt
    contract.innerText = job.contract
    location.innerText = job.location
    const bottomRow = document.createElement("div")
    bottomRow.classList.add("bottom-row")
    bottomRow.append(postedAt, contract, location)
    infoContainer.append(topRow, midRow, bottomRow)
    infoContainer.classList.add("job-info")
    //section 3
    const jobTags = document.createElement("div")
    jobTags.classList.add("job-tags")
    createTag(job.role, jobTags)
    jobContainer.classList.add(`${job.role}`)
    createTag(job.level, jobTags)
    jobContainer.classList.add(`${job.level}`)
    job.languages.forEach(element => {
        jobContainer.classList.add(`${element}`)
        createTag(element, jobTags)   
    });
    
    //main section

    jobContainer.append(logo, infoContainer, jobTags)
    main.append(jobContainer)

}
function createTag(text, parent){
    const tag = document.createElement("button")
    tag.innerText = text
    addFilter(tag)
    parent.append(tag)
}

function addFilter(elem){
    elem.classList.add("clickable-filter")
    elem.addEventListener("click", () => {
        addToFilters(elem.innerText)
    })
    if(!allTags.includes(elem.innerText)){
        allTags.push(elem.innerText)
    }
}
function addToFilters(e) {
    if(!filterList.includes(e)){
        filterList.push(e)
        const filterContainer = document.querySelector(".all-filters")
        filterContainer.parentElement.style.display = "flex"
        const newFilter = document.createElement("div")
        const newFilterText = document.createElement("p")
        newFilterText.innerText = e
        const removeFilter = document.createElement("div")
        removeFilter.classList.add("remove-filter")
        removeFilter.innerHTML = "&times"
        removeFilter.addEventListener("click", () => {
            filterList.splice(filterList.indexOf(e), 1)
            removeFilter.parentElement.remove()
            if(filterList.length === 0){
                filterContainer.parentElement.style.display = "none"
            }
            filterJobs()
        })
        newFilter.append(newFilterText, removeFilter)
        filterContainer.append(newFilter)
        ///filter-out
        filterJobs()
    }
}
const removeAllFilters = document.querySelector(".clear-filters")
removeAllFilters.addEventListener("click", () => {
    filterList = []
    const filterContainer = document.querySelector(".all-filters")
    while (filterContainer.firstChild) {
        filterContainer.removeChild(filterContainer.lastChild);
      }
    filterContainer.parentElement.style.display = "none"
    filterJobs()
})

function filterJobs(){
    let allJobs = document.querySelectorAll(".job")
    allJobs.forEach(k => {
        k.classList.remove("hidden-job")
        console.log(k)
        for(const element of filterList) {
            if(!k.classList.contains(element)){
                console.log(element)
                k.classList.add("hidden-job")
            }
        }
    })
    
}
function filterAutocomplete(){
    const inputLabelsContainer = document.querySelector("header form .labels")
    const inputFilter = document.querySelector("header form input")
    inputFilter.addEventListener("input", () => {
        ///remove old Labels
        const inputLabels = document.querySelectorAll("header form label:not(#main-label)")
        inputLabels.forEach(l => {l.remove()})
        ///array for matching tags
        const matchingTags = []
        ///if input text matches any tag -> add to matchingTags
        allTags.forEach(a => {
            if(a.toLowerCase().includes(inputFilter.value.toLowerCase()) && inputFilter.value !== ""){
                matchingTags.push(a)
            }
        })
        if(matchingTags.length !== 0){
            matchingTags.forEach(m => {
                inputLabelsContainer.append(createLabel(m, inputFilter.name))
            })
        } else {
            inputLabelsContainer.append(createLabel("No results", inputFilter.name))
        }
    })
    
}
filterAutocomplete()

function createLabel(text, forInput) {
    const newLabel = document.createElement("label")
    newLabel.innerText = text
    newLabel.htmlFor = forInput
    newLabel.classList.add("filter-label")
    if(text !== "No results"){
        addFilter(newLabel)
    }
    return newLabel
}