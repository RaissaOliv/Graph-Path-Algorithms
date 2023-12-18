
var inicio;
var destino;

const cidade = {

    school: {'hospital': 10, 'cemetery': 10},
    hospital: {'school': 19, 'nightclub': 15, 'bakery': 15},
    nightclub: {'hospital': 15, 'church': 10},
    cemetery: {'bakery': 5, 'school':5, 'supermarket': 8},
    bakery: {'cemetery': 5, 'hospital': 10, 'park': 10, 'church': 12},
    supermarket: {'pizzeria':10,'cemetery': 8, 'park':5},
    park: {'supermarket': 5, 'museum': 20, 'mall': 10},
    museum: {'church': 10, 'park': 20, 'college': 10},
    pizzeria: {'supermarket':10, 'mall': 6},
    mall: {'pizzeria': 6, 'park': 10, 'college': 24},
    church: {'bakery': 12, 'nightclub': 10, 'museum': 10},
    college: {'museum': 10, 'mall': 24}

}

//when the algorithm visits a location, its color will change to red on the html
function definirVisitado(no){
    let lugar = document.getElementById(no)
    lugar.style.color = '#FFFFFF';
}

// turn the words back to black and empties the result paragraph
function limparVisita(){
    for(let no in cidade){
        let lugar = document.getElementById(no)
        lugar.style.color = '#000'
    }
    document.getElementById('resultado').innerHTML = ""
}

//Promise to pause the function between each color change for 5 seconds
function pausarFuncao(tempo) {
    return new Promise(resolve => setTimeout(resolve, tempo));
}

async function dfs(cidade, inicio, destino, visitados = new Set()) {
    let fila = [inicio];

    while (fila.length > 0) { //The loop continues until the stack is empty
        let no = fila.pop(); //removes the last element of the stack
        console.log(no);
        definirVisitado(no);
        await pausarFuncao(1000);
        
        if (!visitados.has(no)) { //checks if the node have alrady been visited
            visitados.add(no);
            
            if (no === destino) { //if the node is the destination, returns the result
                console.log("End!")
                return "You arrived at the destination: " + no + ". Amount of nodes visited: " + visitados.size;
            }
            // checks for the neighbors of the node. Have they not been visisted, the respective node is added to the stack.
            for (let vizinho in cidade[no]) {
                if (!visitados.has(vizinho)) {
                    fila.push(vizinho);
                }
            }
        }
    }

    return "estination not found";
}


async function Bfs(cidade, inicio, destino, visitados = new Set()) {
    let fila = [inicio]
 
    while (fila.length > 0) {  //Loop continues until the queue is empty
      let no = fila.shift(); //Removes the first element from the queue
      console.log(no);
      definirVisitado(no)
      await pausarFuncao(1000);
      
      if (no === destino) {
        return "You arrived at the destination: " + no + ". Amount of places visited: " + visitados.size;
      }
      
      if (!visitados.has(no)) { //if not on the visisted list, is added there
        visitados.add(no);
        console.log(visitados)

        for (let vizinho in cidade[no]) { //checks for the neighbors of the node. If not visited, the neighbor is added to the queue
          if (!visitados.has(vizinho)) { 
            fila.push(vizinho);
          }
        }
      }
    }
    return "Destination not found";
}


async function dijkstra(cidade, inicio, destino, visitados = new Set()) {
    let fila = [{no: inicio, distancia: 0}]; //Starting node + distance set to zero
    let distancias = {}; // minimum distance
    let anterior = {}; //saves the node that came before the current node
    distancias[inicio] = 0;

    while (fila.length > 0) {
        fila.sort((a, b) => a.distancia - b.distancia); //orders the queue by distance
        let {no, distancia} = fila.shift(); // remove the first element and adds it on the variables
        definirVisitado(no)
        await pausarFuncao(1000);
        if (!visitados.has(no)) {
            visitados.add(no);
            if (no === destino) {
                let caminho = [no];
                while (no !== inicio) {
                    no = anterior[no];
                    caminho.unshift(no);
                }
                return "You arrived at your estination: " + destino + ". Distance: " + distancia + ". Best path: " + caminho.join(' -> ');
            }
            
            let vizinhos = cidade[no];
            for (let vizinho in vizinhos) {
                let distanciaVizinho = distancias[no] + vizinhos[vizinho]; // calculates the distance
                //checks if the distance is smaller than the current one
                if (!distancias[vizinho] || distanciaVizinho < distancias[vizinho]) {
                //in case it is smaller, updates the variables
                    distancias[vizinho] = distanciaVizinho;
                    anterior[vizinho] = no;
                //adds the neighbor in the pile with the new distance
                    fila.push({no: vizinho, distancia: distanciaVizinho});
                }
            }
        }
    }
    return "Destino não encontrado";
}
// functions that get the starting and ending points and make the search algorithms calls to the html
async function initDfs(){
    limparVisita();
    destino = document.getElementById('destino').value
    inicio = document.getElementById('inicio').value
    document.getElementById('resultado').innerHTML = await dfs(cidade, inicio, destino)
}

async function initBfs(){
    limparVisita();
    destino = document.getElementById('destino').value
    inicio = document.getElementById('inicio').value
    document.getElementById('resultado').innerHTML = await Bfs(cidade, inicio, destino)
}

async function initDijkstra(){
    limparVisita();
    destino = document.getElementById('destino').value
    inicio = document.getElementById('inicio').value
    document.getElementById('resultado').innerHTML = await dijkstra(cidade, inicio, destino)
}