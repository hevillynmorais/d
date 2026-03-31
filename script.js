document.addEventListener("DOMContentLoaded", () => {
    const screen = document.getElementById("screen");
    const xmlns = "http://www.w3.org/2000/svg";

    let width, height;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", e => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
    });
    resize();

    const createEntity = (num, isDragon) => {
        const list = [];
        for (let i = 0; i < num; i++) {
            const use = document.createElementNS(xmlns, "use");
            let id = "";

            if (isDragon) {
                if (i === 0) id = "#Cabeza";
                else if (i === 5 || i === 15) id = "#Aletas";
                else id = "#Espina";
            } else {
                id = "#HunterPart";
            }

            use.setAttribute("href", id);
            screen.appendChild(use);

            list[i] = {
                el: use,
                x: width / 2,
                y: height / 2,
                angle: 0,
                scale: isDragon ? (160 - i * 3) / 60 : (80 - i * 4) / 60
            };
        }
        return list;
    };

    const dragon = createEntity(35, true);
    const hunter = createEntity(12, false);

    const update = (list, targetX, targetY, speed, spacing) => {
        let prev = { x: targetX, y: targetY };

        for (let i = 0; i < list.length; i++) {
            const cur = list[i];
            
            cur.x += (prev.x - cur.x) * speed;
            cur.y += (prev.y - cur.y) * speed;
            
            const dx = prev.x - cur.x;
            const dy = prev.y - cur.y;
            cur.angle = Math.atan2(dy, dx);
            
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > spacing) {
                cur.x = prev.x - Math.cos(cur.angle) * spacing;
                cur.y = prev.y - Math.sin(cur.angle) * spacing;
            }

            const deg = cur.angle * (180 / Math.PI);
            // Aplicando transform via style para melhor performance
            cur.el.style.transform = `translate(${cur.x}px, ${cur.y}px) rotate(${deg}deg) scale(${cur.scale})`;
            
            prev = cur;
        }
    };

    const loop = () => {
        // Dragão segue o mouse
        update(dragon, pointer.x, pointer.y, 0.15, 12);
        
        // Caçador segue a ponta da cauda do dragão
        const tail = dragon[dragon.length - 1];
        update(hunter, tail.x, tail.y, 0.08, 10);
        
        requestAnimationFrame(loop);
    };

    loop();
});
