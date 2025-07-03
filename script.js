width = 8
height = 8

grid = document.getElementById("grid")

grid.style.gridTemplateRows = `repeat(${height}, 50px)`
grid.style.gridTemplateColumns = `repeat(${width}, 50px)`

block_types = ["blood", "guts", "brain", "eyes"]

let selected = undefined

for (x = 0; x < width * height; x ++) {
    block = document.createElement('div')
    random_type = block_types[Math.floor(Math.random() * block_types.length)]
    block.setAttribute("type", random_type)
    block.classList.add(random_type)
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

check_matches()

function try_swap(b1, b2) {
    b1.classList.remove("selected")
    b2.classList.remove("selected")
    selected = undefined

    var b1index = Array.prototype.indexOf.call(grid.children, b1);
    b1x = b1index % width
    b1y = Math.floor(b1index / height)

    var b2index = Array.prototype.indexOf.call(grid.children, b2);
    b2x = b2index % width
    b2y = Math.floor(b2index / height)
        

    if ((Math.abs(b1x - b2x) <= 1) && (Math.abs(b1y - b2y) <= 1)) {
        temp = document.createElement("div")
        grid.insertBefore(temp, b2)
        grid.insertBefore(b2, b1)
        grid.insertBefore(b1, temp)

        temp.remove()

        if (check_matches()) {
            remove_blocks()
            add_blocks
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

    function get_block(x, y) {
        if (x >= width) return undefined
        if (y >= height) return undefined

        return grid.children[x + y * width]
    }

    function get_block_attribute(x, y) {
        if (x >= width) return undefined
        if (y >= height) return undefined

        return grid.children[x + y * width].getAttribute("type")
    }

    for (x = 0; x < width; x ++) {
        for (y = 0; y < height; y ++) {

            
            if ( get_block_attribute(x, y) == get_block_attribute(x + 1, y) &&
                    get_block_attribute(x, y) == get_block_attribute(x + 2, y)) 
              {
                get_block(x, y).setAttribute("remove", "true");
                get_block(x + 1, y).setAttribute("remove", "true");
                get_block(x + 2, y).setAttribute("remove", "true");

                matches_flag = true
            }


            if ( get_block_attribute(x, y) == get_block_attribute(x, y + 1) &&
                    get_block_attribute(x, y) == get_block_attribute(x, y + 2)) 
              {


                get_block(x, y).setAttribute("remove", "true");
                get_block(x, y + 1).setAttribute("remove", "true");
                get_block(x, y + 2).setAttribute("remove", "true");

                matches_flag = true
            }

        }
    }

    return matches_flag
}

function remove_blocks() {
    for (block of grid.children) {
        console.log(block)
        if (block.getAttribute("remove") == "true") {
            block.remove()
        }
    }
}

function add_blocks() {
    for (block of grid.children) {
        console.log(block)
        if (block.getAttribute("remove") == "true") {
            block.remove()
        }
    }
}
