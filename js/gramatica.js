class SNDA {
    constructor(transitions) {
        this.transitions = transitions;
    }

    async evaluate(tokens) {
        const rootNode = new Nodo("EXPRESION"); // Raíz del árbol
        // console.log("Evaluando expresión:", tokens);
        const result = await this._evaluate(tokens, "z0", ["M"], rootNode);
        return result ? rootNode : null;
    }

    async _evaluate(tokens, state, stack, currentNode) {
        // console.log(`Estado: ${state}, Pila: ${stack}, Tokens: ${tokens}, Nodo Actual: ${currentNode.valor}`);

        if (stack.length > tokens.length + 1) {
            // console.log("Pila demasiado grande, retornando falso.");
            return false;
        }

        if (tokens.length === 0 && stack.length === 0 && state === "z1") {
            // console.log("Evaluación exitosa, estado de aceptación alcanzado.");
            return true;
        }

        if (tokens.length === 0 || await this.applyEpsilonTransitions(state, stack, tokens, currentNode)) {
            return true;
        }

        if (tokens.length > 0) {
            const token = tokens[0];
            const restTokens = tokens.slice(1);
            const normalizedToken = this.normalizeToken(token);
            const top = stack.pop();

            // console.log(`Token Actual: ${token}, Normalizado: ${normalizedToken}, Top Pila: ${top}`);

            const possibleTransitions = this.getPossibleTransitions(state, normalizedToken, top);
            
            for (const transition of possibleTransitions) {
                const [nextState, pushSymbols] = transition;
                const newStack = [...stack];
                const hermanoActual = currentNode;
                currentNode = siguienteHermano(currentNode);

                if (currentNode === null) {
                    // console.log("No hay siguiente hermano, retornando falso.");
                    return false;
                }

                if (currentNode.valor === "M") {
                    currentNode = currentNode.padre;
                    currentNode.hijos.pop(currentNode.hijos.indexOf(hermanoActual));
                }

                const nodesAdded = [];

                if (pushSymbols) {
                    for (let symbol of pushSymbols.split("").reverse()) {
                        const newNode = currentNode.agregarHijo(symbol);
                        nodesAdded.push(newNode);
                        newStack.push(symbol);
                    }
                }

                // console.log(`Transición a ${nextState}, Símbolos a Push: ${pushSymbols}, Nueva Pila: ${newStack}`);

                if (await this._evaluate(restTokens, nextState, newStack, currentNode)) {
                    return true;
                }

                // Revertir nodos añadidos si la transición no es exitosa
                for (const node of nodesAdded) {
                    currentNode.hijos.pop();
                }

                currentNode = hermanoActual;
            }
        }
        return false;
    }

    async applyEpsilonTransitions(state, stack, tokens, currentNode) {
        const top = stack[stack.length - 1];
        const epsilonKey = `${state},ε,${top}`;
        const transitions = this.transitions[epsilonKey];

        // console.log(`Aplicando transiciones epsilon para ${state}, Top Pila: ${top}`);

        if (transitions) {
            for (const transition of transitions) {
                const [nextState, pushSymbols] = transition;
                const newStack = [...stack];
                newStack.pop();

                const newNode = currentNode;
                const nodesAdded = [];

                if (pushSymbols) {
                    for (let symbol of pushSymbols.split("")) {
                        const childNode = newNode.agregarHijo(symbol);
                        nodesAdded.push(childNode);
                        
                    }
                }

                newStack.push(...pushSymbols.split("").reverse());

                // console.log(`Transición epsilon a ${nextState}, Símbolos a Push: ${pushSymbols}, Nueva Pila: ${newStack}`);

                if (await this._evaluate(tokens, nextState, newStack, newNode.hijos[0])) {
                    return true;
                }

                // Revertir nodos añadidos si la transición no es exitosa
                for (const node of nodesAdded) {
                    newNode.hijos.pop();
                }
            }
        }
        return false;
    }

    getPossibleTransitions(state, token, top) {
        const transitions = [];
        const transitionKey = `${state},${token},${top}`;
        if (this.transitions[transitionKey]) {
            transitions.push(...this.transitions[transitionKey]);
        }

        return transitions;
    }

    normalizeToken(token) {
        const type = automata(token);
        if (type === "constante numérica") {
            return "J";
        } else if (type === "identificador") {
            return "I";
        } else if (token === ";") {
            return token;
        } else if (esOperador(token)) {
            return token;
        } else if (token === "(" || token === ")") {
            return token;
        } else if (token === "=") {
            return token;
        } else {
            return "X";
        }
    }
}


const transitions = {
    "z0,ε,M": [["q", "AM"]],
    "q,ε,A": [["q", "CD"], ["q", "CA"]],
    "q,ε,C": [["q", "VY"]],
    "q,ε,D": [["q", "EZ"]],
    "q,ε,E": [["q", "I"], ["q", "J"], ["q", "PF"], ["q", "EG"]],
    "q,ε,F": [["q", "EQ"]],
    "q,ε,G": [["q", "HE"]],
    "q,ε,V": [["q", "I"]],
    "q,ε,H": [["q", "+"], ["q", "-"], ["q", "*"], ["q", "/"], ["q", "^"], ["q", "%"]],
    "q,ε,Y": [["q", "="]],
    "q,ε,Z": [["q", ";"]],
    "q,ε,P": [["q", "("]],
    "q,ε,Q": [["q", ")"]],
    "q,I,I": [["q", ""]],
    "q,J,J": [["q", ""]],
    "q,+,+": [["q", ""]],
    "q,-,-": [["q", ""]],
    "q,*,*": [["q", ""]],
    "q,/,/": [["q", ""]],
    "q,^,^": [["q", ""]],
    "q,%,%": [["q", ""]],
    "q,=,=": [["q", ""]],
    "q,(,(": [["q", ""]],
    "q,),)": [["q", ""]],
    "q,;,;": [["q", ""]],
    "q,ε,M": [["z1", ""]],
};

/*const transitions = {
    "z0,ε,M": [["q", "AM"]],
    "q,ε,A": [["q", "I=E;"], ["q", "I=A"]],
    "q,ε,E": [["q", "I"], ["q", "J"], ["q", "EKE"], ["q", "(E)"]],
    "q,ε,K": [["q", "+"], ["q", "-"], ["q", "*"], ["q", "/"], ["q", "^"], ["q", "%"]],
    "q,I,I": [["q", ""]],
    "q,J,J": [["q", ""]],
    "q,+,+": [["q", ""]],
    "q,-,-": [["q", ""]],
    "q,*,*": [["q", ""]],
    "q,/,/": [["q", ""]],
    "q,^,^": [["q", ""]],
    "q,%,%": [["q", ""]],
    "q,=,=": [["q", ""]],
    "q,(,(": [["q", ""]],
    "q,),)": [["q", ""]],
    "q,;,;": [["q", ""]],
    "q,ε,M": [["z1", ""]],
  };*/

  async function evaluateExpression(expression) {
    const tokens = tokenizeExpression(expression);

    const snda = new SNDA(transitions);

    const derivationTree = await snda.evaluate(tokens);
    if (derivationTree) {
        const arbolD3 = convertirArbolParaD3(derivationTree);
        displayTree(arbolD3);
        imprimirArbol(derivationTree);
        return "Expresión válida";
    } else {
        return "Expresión inválida";
    }
}


function tokenizeExpression(expression) {
  let tokens = [];
  let currentToken = '';

  for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if ("+-*/%^;,=()".includes(char)) {
          if ((char === '+' || char === '-') && currentToken.length > 0 && (currentToken[currentToken.length - 1] === 'E' || currentToken[currentToken.length - 1] === 'e')) {
              currentToken += char;
          } else {
              if (currentToken.length > 0) {
                  tokens.push(currentToken);
                  currentToken = '';
              }
              tokens.push(char);
          }
      } else if (char === ' ') {
          if (currentToken.length > 0) {
              tokens.push(currentToken);
              currentToken = '';
          }
      } else {
          currentToken += char;
      }
  }

  if (currentToken.length > 0) {
      tokens.push(currentToken);
  }

  return tokens;
}

// Definición de la clase Nodo para referencia
class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.hijos = [];
        this.padre = null;
    }

    agregarHijo(valor) {
        const hijo = new Nodo(valor);
        hijo.padre = this;
        this.hijos.push(hijo);
        return hijo;
    }
}

function convertirArbolParaD3(nodo) {
    const convertido = {
        name: nodo.valor,
        children: nodo.hijos.map(hijo => convertirArbolParaD3(hijo))
    };
    return convertido;
}

function displayTree(arbol) {
    const svgContainer = d3.select("#tree").html("");
    const width = 1000, height = 600; // Ajustar el tamaño según sea necesario
    const svg = svgContainer.append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("user-select", "none");

    const g = svg.append("g").attr("transform", "translate(40,20)");

    // Convertir la estructura del árbol para D3.js
    const root = d3.hierarchy(arbol);

    const treeLayout = d3.tree().size([width - 80, height - 40]); // Invertir width y height para árbol vertical
    treeLayout(root);

    // Dibujar enlaces
    g.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical() // Cambiar a d3.linkVertical()
            .x(d => d.x) // Cambiar d.y a d.x
            .y(d => d.y)) // Cambiar d.x a d.y
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-width", 1.5);

    // Dibujar nodos
    const node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`); // Cambiar y,x a x,y

    node.append("circle")
        .attr("r", 5)
        .style("fill", d => d.children ? "#fff" : "red") // Color blanco para nodos internos, rojo para hojas
        .style("stroke", "steelblue")
        .style("stroke-width", "1.5px");

    node.append("text")
        .attr("dy", 3)
        .attr("x", d => d.children ? -10 : 10) // Ajustar la posición del texto
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name); // Mostrar el símbolo del nodo
}



function siguienteHermano(nodo) {
    let padre = nodo.padre;
    if (!padre) return null;

    let indice = padre.hijos.indexOf(nodo);
    if (indice === padre.hijos.length - 1) {
        return siguienteHermano(padre);
    }

    return padre.hijos[indice + 1];
}

// Función para imprimir el árbol en consola
function imprimirArbol(nodo, nivel = 0) {
    if (!nodo) return;
    // console.log(' '.repeat(nivel) + nodo.valor);
    nodo.hijos.forEach(hijo => imprimirArbol(hijo, nivel + 1));
}
