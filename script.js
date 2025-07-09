width = 8
height = 8

danger = .5

grid = document.getElementById("grid")

grid.style.gridTemplateRows = `repeat(${height}, 50px)`
grid.style.gridTemplateColumns = `repeat(${width}, 50px)`

block_types = ["blood", "guts", "brain", "eyes"]

let selected = undefined

internal_grid = []

for (y = 0; y < height; y ++) {
    internal_grid[y] = []
}

function get_block(x, y) {
    return internal_grid[y][x]
}

function set_block(x, y, block) {
    internal_grid[y][x] = block

    if (block == undefined) {
        return
    }

    block.style.gridColumn = `${x + 1} / ${x + 1} `
    block.style.gridRow = `${y + 1} / ${y + 1}`
}

function swap_blocks(x1, y1, x2, y2) {

    hold = get_block(x1, y1)
    set_block(x1, y1, get_block(x2, y2))
    set_block(x2, y2, hold)

}

function get_coordinates(block) {
    for (y = 0; y < height; y ++) {
    
        for (x = 0; x < width; x ++) {
            if (internal_grid[y][x] == block)
                return [x, y]
        }
    }
    return undefined
}


function delete_block(x, y) {
    internal_grid[y][x].remove()
    delete internal_grid[y][x]

}

function block_factory() {

    block = document.createElement('div')
    random_type = block_types[Math.floor(Math.random() * block_types.length)]
    block.setAttribute("type", random_type)
    block.classList.add(random_type)
    block.classList.add("block")

    block.addEventListener('click', (e) => {
        e.currentTarget.classList.add("selected");
        if (selected == undefined)
            selected = e.currentTarget
        else {
            try_swap(selected, e.currentTarget)
            finish_iteration()
        }
    })

    // block.addEventListener('transitionend', (e) => {

    //     e.target.style.transition = ``;
    //     e.target.style.transform = ``;

    // })

    return block
}


for (y = 0; y < height; y ++) {
    
    for (x = 0; x < width; x ++) {
        
        block = block_factory()
        
        set_block(x, y, block)
        grid.appendChild(block) 

    }
}

function try_swap(b1, b2) {

    swap_time = .25

    b1.classList.remove("selected")
    b2.classList.remove("selected")
    selected = undefined

    var b1coord = get_coordinates(b1);
    b1x = b1coord[0]
    b1y = b1coord[1]

    var b2coord = get_coordinates(b2);
    b2x = b2coord[0]
    b2y = b2coord[1]
        

    if ((Math.abs(b1x - b2x) <= 1) && (Math.abs(b1y - b2y) <= 1)) {

        swap_blocks(b1x, b1y, b2x, b2y)
        

        if (check_matches()) {
            b1.style.transform = `translateY(${-(b2y - b1y) * 50}px) translateX(${-(b2x - b1x) * 50}px)`; // initial state
            b2.style.transform = `translateY(${-(b1y - b2y) * 50}px) translateX(${-(b1x - b2x) * 50}px)`; // initial state
            
            // Force layout reflow
            void b1.offsetHeight;


            requestAnimationFrame(() => {
                
                b1.style.transition = `transform ${swap_time}s ease`;

                b2.style.transition = `transform ${swap_time}s ease`;
                b2.style.transform = "translateY(0px) translateX(0px)";
            b1.style.transform = `translateY(0px) translateX(0px)`;

            });

            setTimeout(() => {

                b1.style.transition = "";
                b1.style.transform = "";

                b2.style.transition = "";
                b2.style.transform = "";

            }, swap_time * 1000)

            
        }
        else {  
            swap_blocks(b1x, b1y, b2x, b2y)

        }

    }
}


function check_matches() {

    matches_flag = false

    function get_type(x, y) {
        block = get_block(x, y)

        if (block == undefined)
            return NaN

        return get_block(x, y).getAttribute("type")
    }


    for (x = 0; x < width; x ++) {
        for (y = 0; y < height; y ++) {

            
            if (x < width - 2 && get_type(x, y) == get_type(x + 1, y) &&
                    get_type(x, y) == get_type(x + 2, y)) 
              {
                get_block(x, y).setAttribute("remove", "true");
                get_block(x + 1, y).setAttribute("remove", "true");
                get_block(x + 2, y).setAttribute("remove", "true");

                get_block(x, y).classList.add("remove")
                get_block(x + 1, y).classList.add("remove")
                get_block(x + 2, y).classList.add("remove")

                matches_flag = true
            }


            if (y < height - 2 && get_type(x, y) == get_type(x, y + 1) &&
                    get_type(x, y) == get_type(x, y + 2)) 
              {


                get_block(x, y).setAttribute("remove", "true");
                get_block(x, y + 1).setAttribute("remove", "true");
                get_block(x, y + 2).setAttribute("remove", "true");

                get_block(x, y).classList.add("remove")
                get_block(x, y + 1).classList.add("remove")
                get_block(x, y + 2).classList.add("remove")

                matches_flag = true
            }

        }
    }

    return matches_flag
}

function remove_blocks() {
    
    for (y = 0; y < height; y ++) {
        
        for (x = 0; x < width; x ++) {
            if (get_block(x, y) == undefined)
                continue

            if (get_block(x, y).getAttribute("remove") == "true") {
                delete_block(x, y)
            }
        }
    }
}

function sift_blocks() {

    for (i = 0; i < height; i ++) {

        for (x = 0; x < width; x ++) {
            
            for (y = height - 1; y >= 0; y--) {

                block = get_block(x, y)

                if (block == undefined) continue
                if (y == height - 1) continue

                if ((get_block(x, y + 1) == undefined)) {
                    swap_blocks(x, y, x, y + 1)

                    if (block.getAttribute("fall") == null)
                        block.setAttribute("fall", 1);
                    else
                        block.setAttribute("fall", Number(block.getAttribute("fall")) + 1)
                }

            }
        }
    }
}

function add_blocks_top() {

    for (x = 0; x < width; x ++) {
            
        for (y = 0; y < height; y++) {

            block = get_block(x, y)

            if (block != undefined) continue

            set_block(x, y, block_factory())
            block.setAttribute("fall", height)

            grid.appendChild(block) 

        }
    }

}

function animate_block_fall() {

    for (x = 0; x < width; x ++) {
    
        for (y = height - 1; y >= 0; y--) {

            block = get_block(x, y)

            if (block == undefined) continue

            fall_height = block.getAttribute("fall")

            block.style.transform += `translateY(${-50 * fall_height}px) `;

        }
    }    

    setTimeout(() => {

        for (x = 0; x < width; x ++) {
    
            for (y = height - 1; y >= 0; y--) {

                block = get_block(x, y)

                if (block == undefined) continue

                fall_height = block.getAttribute("fall")

                block.style.transition = `transform ${1}s cubic-bezier(0.7, 0, 0.84, .5)`;
                block.style.transform = "translateY(0px) translateX(0px)"

                block.removeAttribute("fall");

            }
        }

    }, 100);
}

function iteration() {
    check_matches()
    remove_blocks()
    sift_blocks()
    add_blocks_top()
    animate_block_fall()
}

function finish_iteration() {
    remove_blocks()
    sift_blocks()
    add_blocks_top()
    animate_block_fall()

    setTimeout(() => {
        if (check_matches())
            finish_iteration()
    }, 1000)
    
}



function updates() {
    document.documentElement.style.setProperty("--danger", danger)

    setTimeout(() => {
        updates()  
    }, 10)
}

function reflow(elt){
    console.log(elt.offsetHeight);
}