import { Component, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

/*interface Image {
  title : string;
  url : string;
  cssClass? : string;
}*/

@Component({
    selector   : 'ff-carousel',
    templateUrl: 'carousel.component.html',
    styleUrls  : ['carousel.component.scss']
})
export class CarouselComponent implements OnDestroy {
    @Input() autoplay = false;
    @Input() interval = 2000;
    @Input() animationDuration = 500;
    @Input() buttons = true;
    @Input() selectItem = true;
    @Input() shadow = '';

    @Input()
    set images(value) {
        this._images = value;
        this.init();
    }

    get images() {
        return this._images;
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.init();
    }

    _images = [];
    amountClone = 0;
    length : any;
    sliderWidth : any;
    slideWidth : any;
    timer : any;
    center : any;
    left : any;
    animation = false;
    transition = '0s';

    constructor(private el : ElementRef) {
    }

    onLoad() {
        this.init();
    }

    init() {
        this.stop();
        if (!this.images) {
            this.images = [];
        }
        this.slideWidth = this.getWidth(this.el.nativeElement.querySelector('.ff-slider__slide'));
        this.sliderWidth = this.getWidth(this.el.nativeElement);
        this.length = this.images.length;
        this.center = (this.sliderWidth - (this.length * this.slideWidth)) / 2 - (this.slideWidth * (this.length - 1) / 2);
        this.left = this.center;
        this.amountClone = Math.round(this.sliderWidth / (this.length * this.slideWidth) * 2);
        this.play();
    }

    getWidth(elem : any) {
        if (!elem) {
            return;
        }
        const style = elem.currentStyle || window.getComputedStyle(elem),
            width = elem.offsetWidth,
            margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
            padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
            border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        return width + margin + padding + border;
    }

    nextSlide(left = 1) {
        if (this.animation) {
            return;
        }
        this.animation = true;
        this.transition = this.animationDuration + "ms ease";
        this.left += left * -this.slideWidth;
        window.setTimeout(() => {
            while (left) {
                const first = this.el.nativeElement.querySelectorAll('.ff-slider__slide')[0];
                this.el.nativeElement.querySelector('.ff-slider__tracker').appendChild(first);
                left--;
            }
            this.transition = '0s';
            this.left = this.center;
            this.animation = false;
        }, this.animationDuration);
    }

    previousSlide(left = 1) {
        if (this.animation) {
            return;
        }
        this.animation = true;
        this.transition = this.animationDuration + "ms ease";
        this.left += left * this.slideWidth;
        window.setTimeout(() => {
            while (left) {
                const last = this.el.nativeElement.querySelectorAll('.ff-slider__slide')[this.el.nativeElement.querySelectorAll('.ff-slider__slide').length - 1];
                this.el.nativeElement.querySelector('.ff-slider__tracker').prepend(last);
                left--;
            }

            this.transition = '0s';
            this.left = this.center;
            this.animation = false;
        }, this.animationDuration);
    }

    play() {
        if (this.autoplay) {
            if (this.timer) {
                return;
            }
            this.timer = setInterval(() => {
                    this.nextSlide(1);
                },
                this.interval);
        }
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    select(i: any) {
        if (this.animation) {
            return;
        }
        const position = this.position(i),
            center = this.slideWidth * this.length - this.slideWidth;
        if (center === position.left) {
            return;
        } else if (center > position.left) {
            this.previousSlide((center - position.left) / this.slideWidth)
        } else if (center < position.left) {
            this.nextSlide((center - position.left) / -this.slideWidth);
        }
    }

    ngOnDestroy() {
        this.stop();
    }

    offset(elem : any) {
        if (!elem) {
            return {
                top : 0,
                left: 0
            };
        }
        let rect, win;
        if (!elem.getClientRects().length) {
            return { top: 0, left: 0 };
        }
        rect = elem.getBoundingClientRect();
        win = elem.ownerDocument.defaultView;
        return {
            top : rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
        };
    };

    position(elem : any) {
        if (!elem) {
            return {
                left: 0,
                top : 0
            };
        }
        let offsetParent, offset, doc,
            parentOffset = { top: 0, left: 0 };
        if (elem.style.position === 'fixed') {
            offset = elem.getBoundingClientRect();
        } else {
            offset = this.offset(elem);
            doc = elem.ownerDocument;
            offsetParent = elem.offsetParent || doc.documentElement;
            while (offsetParent &&
            ( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
            offsetParent.style.position === "static") {
                offsetParent = offsetParent.parentNode;
            }
            if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
                parentOffset = this.offset(offsetParent);
                parentOffset.top += offsetParent.style.borderTopWidth;
                parentOffset.left += offsetParent.style.borderLeftWidth;
            }
        }
        const style = elem.currentStyle || window.getComputedStyle(elem);
        return {
            top : offset.top - parentOffset.top - parseFloat(style.marginTop),
            left: offset.left - parentOffset.left - parseFloat(style.marginLeft)
        };
    }

    /*  onDragStart(event) {
        console.log('start', event);
        console.log('target', event.target.closest('.ff-slider__tracker'));
        const element = event.target.closest('.ff-slider__tracker');
        document.onmousemove = (e)=>{
          if(element){
             let x =e.pageX - element.getBoundingClientRect().left + pageXOffset;
             element.style.left = x + 'px';
          }
          document.onmouseup = ()=>{
            document.onmousemove = null;
            document.onmouseup = null;
          }
        };
      }*/
}
