import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Md5 } from 'ts-md5';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild("firstText", { static: false }) firstText!: ElementRef;
  @ViewChild("secondText", { static: false }) secondText!: ElementRef;
  title = 'poc';
  textExample:any = 'Lorem ipsum dolor sit amet. 33 corporis libero aut voluptatem eligendi eos aliquid vero. Et laudantium illo ut consequatur dignissimos aut tenetur voluptatem ut accusantium consequatur et quia maxime a minus dolorem est tempore sint! Et minima repellendus et iure inventore qui ratione nihil id numquam ducimus eum corporis earum et dolor ipsa eos alias fugiat. Nam commodi veritatis ad consectetur nulla est velit aliquid 33 quia quasi qui sapiente beatae. Ad enim saepe id consequatur aliquam non laboriosam ratione cum fugit fuga ab modi debitis! Qui similique odio At culpa temporibus sit distinctio sunt quo possimus eaque id inventore necessitatibus ut voluptas dicta.';
  textBox:any;

  constructor(private elementRef:ElementRef,
    private renderer:Renderer2,
    private rendererFactory:RendererFactory2,
    private route:ActivatedRoute,
    private router:Router ) {}

  ngOnInit() {
    this.textBox = this.textExample;
  }

  ngAfterViewInit(){
    this.loadComments();
  }

  selectionText(event:Event){
    event.preventDefault();
    let selection = window.getSelection();
    // let {anchorNode, anchorOffset, focusNode, focusOffset} = selection;
    // console.log(anchorNode);
    // console.log(anchorOffset);
    // console.log(focusNode);
    // console.log(focusOffset);
    let text = selection?.toString() ?? "";
    if(text !== ""){
      // let text = this.renderer.createText("my button");
      // this.renderer.setValue(this.myDomeElem.nativeElement, text);

      let comment:string = window.prompt("Insert your comment:") ?? "";
      if(comment !== "")
      {
        let start = selection?.anchorOffset ?? 0;
        let end = selection?.focusOffset ?? 0;
        this.renderer.setProperty(this.firstText.nativeElement, 'innerHTML', this.highlightText(this.firstText.nativeElement.innerHTML, text, comment));
        console.log(`start:${start}, end:${end}`);
        console.log(comment);
        let data = { start:start, end:end, comment: comment, selection:text };
        let hashCode = Md5.hashStr(text);
        console.log(hashCode);
        localStorage.setItem(hashCode, JSON.stringify(data));
        this.addComments(text, comment)
      }
    }
  }

  highlightText (texBox:string, text:string, comment:string) {
    let str = texBox;
    let re = new RegExp(text.trim(), 'gi');
    let match = str.match(re);
    // If there's no match, just return the original value.
    if (!match) {
      return str;
    }

    // let replacedValue = str.replace(re, '<mark>' + match[0] + '</mark>');
    let replacedValue = str.replace(re, `<a href='/comment/${comment}'>${match[0]}</a>`);
    return replacedValue;
}

  loadComments():void{
    let items = { ...localStorage };
    let values = Object.values(items);
    let br = this.renderer.createElement('br');
    this.renderer.appendChild(this.firstText.nativeElement, br);
    values.forEach(element => {
      let data = JSON.parse(element);
      console.log(data);
      this.addComments(data.selection, data.comment);
    });
  }

  addComments(selection:string, comment:string){
    let br = this.renderer.createElement('br');
    let br2 = this.renderer.createElement('br');
    this.renderer.setProperty(this.firstText.nativeElement, 'innerHTML', this.highlightText(this.firstText.nativeElement.innerHTML, selection, comment));
    let commentLabel = this.renderer.createElement('mark');
    let tooltip = this.renderer.createElement('span');
    let commentLabelText = this.renderer.createText(selection);
    let tooltipText = this.renderer.createText(comment);
    this.renderer.addClass(commentLabel, 'tooltip-custom');
    this.renderer.addClass(tooltip, 'tooltiptext-custom');
    this.renderer.listen(commentLabel, 'click', this.test);
    this.renderer.appendChild(commentLabel, commentLabelText);
    this.renderer.appendChild(tooltip, tooltipText);
    this.renderer.appendChild(commentLabel, tooltip);
    this.renderer.appendChild(this.firstText.nativeElement, br);
    this.renderer.appendChild(this.firstText.nativeElement, br2);
    this.renderer.appendChild(this.firstText.nativeElement, commentLabel);
  }

  test(){
    alert('click');
  }

  clearComments(){
    localStorage.clear();
    // this.router.navigate(['/']);
    window.location.reload();
  }
}
