width = 8
height = 8

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


for (y = 0; y < height; y ++) {
    
    for (x = 0; x < width; x ++) {
        
        block = document.createElement('div')
        random_type = block_types[Math.floor(Math.random() * block_types.length)]
        block.setAttribute("type", random_type)
        block.classList.add(random_type)
        block.classList.add("block")
        
        set_block(x, y, block)
        grid.appendChild(block) 

        block.addEventListener('click', (e) => {
            e.currentTarget.classList.add("selected");
            if (selected == undefined)
                selected = e.currentTarget
            else {
                try_swap(selected, e.currentTarget)
            }
        })

    }
}

function try_swap(b1, b2) {
    b1.classList.remove("selected")
    b2.classList.remove("selected")
    selected = undefined

    var b1coord = get_coordinates(b1);
    b1x = b1coord[0]
    b1y = b1coord[1]

    var b2coord = get_coordinates(b2);
    b2x = b2coord[0]
    b2y = b2coord[1]

    console.log(b1coord, b2coord)
        

    if ((Math.abs(b1x - b2x) <= 1) && (Math.abs(b1y - b2y) <= 1)) {
        

        if (check_matches()) {

            

            remove_blocks()
            add_blocks()
        }
        else {  
            temp = document.createElement("div")
            grid.insertBefore(temp, b2)
            grid.insertBefore(b2, b1)
            grid.insertBefore(b1, temp)

            temp.remove()
        }

    }
}


function check_matches() {

    matches_flag = false


    for (x = 0; x < width; x ++) {
        for (y = 0; y < height; y ++) {

            
            if (x < width - 2 && get_block(x, y).getAttribute("type") == get_block(x + 1, y).getAttribute("type") &&
                    get_block(x, y).getAttribute("type") == get_block(x + 2, y).getAttribute("type")) 
              {
                get_block(x, y).setAttribute("remove", "true");
                get_block(x + 1, y).setAttribute("remove", "true");
                get_block(x + 2, y).setAttribute("remove", "true");

                get_block(x, y).classList.add("remove")
                get_block(x + 1, y).classList.add("remove")
                get_block(x + 2, y).classList.add("remove")

                matches_flag = true
            }


            if (y < height - 2 && get_block(x, y).getAttribute("type") == get_block(x, y + 1).getAttribute("type") &&
                    get_block(x, y).getAttribute("type") == get_block(x, y + 2).getAttribute("type")) 
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
            console.log(get_block(x, y))

            if (get_block(x, y).getAttribute("remove") == "true") {
                delete_block(x, y)
            }
        }
    }
}

function add_blocks() {
    // for (block of grid.children) {
    //     console.log(block)
    //     if (block.getAttribute("remove") == "true") {
    //         block.remove()
    //     }
    // }
}
