const qnaJson = {
    "0": {
        "question": "What is a spatial predicate?",
        "answer": "<span class='body-accent'>A spatial predicate is a representation of the topological relationship between two entities</span> (or <em>features</em>). It can either be <code>true</code> or <code>false</code>. GIS applications relie on spatial predicates to describe the arrangement of features with other features.<br>The most common spatial predicates are listed in the above table : <code>contains</code>, <code>crosses</code>, <code>equals</code>, <code>intersect</code>, <code>overlaps</code>, <code>touches</code> and <code>within</code>. <span class='body-accent'>They may seem self-explanatory, but some of them are tricky!</span>"
    },
    "1": {
        "question":"How come there are different results accross services ?",
        "answer":"Spatial predicates are typically discussed in academic litterature. The Open Geospatial Consortium (OGC) provides a standard definition of spatial predicates that is well established among the geospatial community, but it is up to each GIS software editor to follow these standards. Moreover, even with a common definition, <span class='body-accent'>spatial predicate opereations’ results may vary in some edge cases, simply because spatial predicates are implemented differently within each software.</span>"
    },
    "2": {
        "question":"These two features are clearly touching, and yet it says that <code>touches = false</code>. What is this madness ?",
        "answer":"A feature is comprised of an interior, a boundary and an exterior. For polygons, interior, boundary and exterior are obvious. For lines, though, it’s a bit more complicated : the boundaries are the two endpoints, everything inbetween is the interior and the rest is the exterior. As for points, the interior is the point itself, the boundary doesn’t exist and the rest is the exterior.<br>Thing is, <code>A touches B</code> is <code>true</code> if A’s boundary touches B’s boundary and if A and B’s interior don’t intersect. <span class='body-accent'>So, as unintuitive as it sounds, two intersecting polygons actually don’t touch!</span> Overall, <code>kiss</code> would be a better yet more provoctive name for this predicate.<br>For more info about spatial predicates as definied by the OGC, you can check out <a href='docs.safe.com/fme/html/FME-Form-Documentation/FME-Transformers/Transformers/spatialrelations.htm'>this</a> implementation by FME editor Safe.<br>If you want to know more about the algorithm behind spatial predicates, I sugest you read <a href='https://postgis.net/workshops/postgis-intro/de9im.html'>this explaination of the DE9IM</a> in the introduction to PostGIS."
    }
}

class Answer extends HTMLElement {
    constructor(text) {
        super();
        this.text = text;
    }

    connectedCallback() {
        this.innerHTML = this.text
    }
}
window.customElements.define('app-answer', Answer)

class Question extends HTMLElement {
    constructor(text) {
        super();
        this.text = text;
    }

    connectedCallback() {
        this.innerHTML = this.text
    }
}
window.customElements.define('app-question', Question)

class Qna extends HTMLElement {
    constructor(question, answer) {
        super();
        this.question = question;
        this.answer = answer;
    }

    connectedCallback() {
        const details = document.createElement('details');
        
        const summary = document.createElement('summary');
        summary.appendChild(this.question);

        details.appendChild(summary);
        details.appendChild(this.answer);
        
        this.appendChild(details);
    }
}
window.customElements.define('app-qna', Qna)

class QnaCollection extends HTMLElement {
    constructor() {
        super();
        this.QnaJson = qnaJson;
    }

    connectedCallback() {
        for (var i in this.QnaJson) {
            const question = new Question(this.QnaJson[i].question);
            const answer = new Answer(this.QnaJson[i].answer);
            const qna = new Qna(question, answer);
            this.appendChild(qna);
        }
    }
}
window.customElements.define('app-qna-collection', QnaCollection)


