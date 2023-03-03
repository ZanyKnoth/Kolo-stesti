        let cont = document.getElementById("container");   
        let te = document.getElementById("text");    
        let canv = cont.getContext("2d");        
        let fieldArr = [];
        let piecesArr = [];
        let size = 4;
        let lock = false;
        let distance;
        let x;
        let y;
        let angg;
 
        function Chart(params, xa, ya)
        {      
          this.x = xa;
          this.y = ya;
          this.params = params;
          this.pieces = 360/this.params.length;
          this.points = [];
          this.angle = 0;
          this.pointer = 360;
          this.incr = 0;
          this.inc = 0;
          this.speed = 0;
          this.touched = -1;

          this.update = function()
          {  
            this.incr = 0;
            this.points = [];
            
             
            for(let i = 0; i < 360; i+=this.pieces)
            {
              // vnitřní loop a cos/sin u this.x a this.y je pro oddálení dílků grafu od středu. Opěrným bodem je prostředek jednotlivého dílku. 
              // Oddálení logicky dokáže nahradit i oddělení pomocí čar v pod tímhle celým loopem.
              
              for(let j = 0; j < this.pieces; j++)
              {
                canv.beginPath();
                  canv.moveTo((this.x+Math.cos((i+this.pieces/2)/57.2957795) * (this.touched == (i/this.pieces) ? 10 : 0)) + Math.cos((i+j)/57.2957795), (this.y+Math.sin((i+this.pieces/2)/57.2957795) * (this.touched == (i/this.pieces) ? 10 : 0)) + Math.sin((i+j)/57.2957795));
                  canv.lineTo((this.x+Math.cos((i+this.pieces/2)/57.2957795) * (this.touched == (i/this.pieces) ? 10 : 0)) + Math.cos((i+j)/57.2957795) * 70, (this.y+Math.sin((i+this.pieces/2)/57.2957795) * (this.touched == (i/this.pieces) ? 10 : 0)) + Math.sin((i+j)/57.2957795) * 70);
                  canv.lineWidth = "2";
                  canv.strokeStyle = "purple";
                  canv.stroke();
                canv.closePath();
              } 
            }
            
            for(let k = this.angle; k < this.angle + 360; )
            {
              this.points.push([k]);
              
              for(let l = 0; l < .5; l+=.25)
              {
                canv.beginPath();
                  canv.moveTo(this.x + Math.cos((k+l)/57.2957795) * -1, this.y + Math.sin((k+l)/57.2957795) * -1);
                  canv.lineTo(this.x + Math.cos((k+l)/57.2957795) * 70, this.y + Math.sin((k+l)/57.2957795) * 70);
                  canv.strokeStyle = "white";
                  canv.stroke();
                canv.closePath();
                
              }
              
              canv.beginPath();
                canv.fillStyle = "white";
                canv.font = "15px Arial";
                canv.textBaseline = "middle"; 
                canv.textAlign = "center";
                canv.fillText(this.params[this.incr], this.x + Math.cos((k+this.pieces/2)/57.2957795) * (this.incr == this.touched ? 57 : 47), this.y + Math.sin((k+this.pieces/2)/57.2957795) * (this.incr == this.touched ? 57 : 47));
              canv.closePath();
                
              k+=this.pieces;
              this.points[this.incr].push(k);
              
              this.incr++;
              
            } 

          } 
          
          this.highlight = function()
          {
            this.touched = -1;
            for(let m = 0; m < this.points.length; m++)
            {
              if(this.points[m][0] < angg && this.points[m][1] > angg)
              {
                this.touched = m;

                break;
                  
              }
              
            }
          
          }
          
          this.animate = function()
          {
            if(this.speed > 0)
            {
              this.angle+=this.speed;
              this.inc+=this.speed;
              
              this.speed-=.01
              
            }
            
            if(this.inc > 360)
            {
              this.inc = this.inc % 360;
              this.pointer+=360;
              
            }
            
            if(this.speed < 0)
            {
              this.speed = 0;
              for(let i = 0; i < this.points.length; i++)
              {
                if(this.points[i][0] < this.pointer && this.points[i][1] > this.pointer)
                {
                  let p = document.createElement("p");
                  p.innerHTML = this.params[i];
                  te.appendChild(p);

                  break;
                  
                }
              
              }
              
              lock = false;
            
            }
            
            canv.beginPath();
              canv.moveTo(this.x + Math.cos(this.pointer/57.2957795) * 73, this.y + Math.sin(this.pointer/57.2957795) * 73);
              canv.lineTo(this.x + Math.cos(this.pointer/57.2957795) * 80, this.y + Math.sin(this.pointer/57.2957795) * 80);
              canv.strokeStyle = "black"
              canv.stroke();
            canv.closePath();
            
            canv.beginPath();
              canv.arc(this.x, this.y, 18, 0, Math.PI*2);
              canv.fillStyle = "yellow";
              canv.fill();
            canv.closePath();
            
            canv.save();
            canv.translate(this.x, this.y)
            canv.rotate(this.angle/57.2957795);
            canv.beginPath();
              canv.fillStyle = "black";
              canv.font = "13px Arial";
              canv.textBaseline = "middle"; 
              canv.textAlign = "center";
              canv.fillText("SPIN", 0, 0);
            canv.closePath();
            canv.restore();
          
          }
          
        }
        
        let pi = new Chart([1, 2, 3, 4, 5], 200, 200); 

        let spust = function() {   
          anim = requestAnimationFrame(spust);      
          canv.clearRect(0, 0, 1000, 1000);  
             
           pi.update(); 
           pi.animate();
           
        }        
           
        spust(); 
      
        function click(event)
        {
          x = event.clientX-cont.offsetLeft;
          y = event.clientY-cont.offsetTop; 
          
          distance = Math.sqrt(Math.pow(pi.x-x, 2)+Math.pow(pi.y-y, 2));
          
          
       
          if(distance < 18 /* 70 */ && lock == false)
          {
            te.innerHTML = "";
            pi.speed = Math.floor(Math.random() * 11) + 0.1;
            
            //angg zakomentovat/odkomentovat, pokud nechci/chci zvýraznění dílku grafu po kliknutí
            
            /* angg = Math.atan2(y-pi.y, x-pi.x)*57.2957795;
            angg = angg < 0 ? 360-Math.abs(angg) : angg; */
            
            lock = true;
          
          } else {
            
            // angg = -1;
          
          }
        }
        
        cont.addEventListener("click", function(){click(event)});