class HeaderTitle extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id=container>
            <p>Does it&nbsp;</p>
            <div id=flip>
                <div><div>&lt;spatial predicate&gt;</div></div>
                <div><div>cross</div></div>
                <div><div>touch</div></div>
                <div><div>contain</div></div>
                <div><div>intersect</div></div>
            </div>
        </div>
        `
    }
}
window.customElements.define('app-header-title', HeaderTitle)