function main() {
    var set = new Array();

    set.push([1, 4.00]);
    set.push([2, 2.80]);
    set.push([3, 3.00]);
    set.push([4, 8.50]);
    set.push([5, 4.60]);
    set.push([6, 3.28]);
    set.push([7, 4.78]);
    set.push([8, 5.22]);
    set.push([9, 2.18]);

    var o = "";

    o += ("{");
    for (let e in set) {
        o += ("(" + set[e][0] + ", " + set[e][1] + "),");
    }
    o += ("}");
    console.log(o.replace(/\),\}/g, ")}"));
    var n = 9;//grau do polinmio +1

    var result = findAproximation(set, n);

    console.log("Resultado Matriz de aproximação");
    console.log(matrixToString(result));

    var sb = "";
    sb += ("\n\nf(x) = ");
    for (var g = 0; g < result.length; g++) {
        sb += ("" + result[g] + "x^" + g + " + ");
    }

    console.log(sb.toString().replace(/ \\+ $/, ""));
//		 double m =
    //
    //
}

function findAproximation(set, n) {

    var xSet = getXfromMatrix(set);
    var matrixX = matrix(n);
    for (let k = 0; k < n; k++) {
        for (var i = 0; i < n; i++) {
            matrixX[k][i] = sum(k + i, xSet);
        }
    }
    var matrixY = new Array(n);

    for (let k = 0; k < n; k++) {
        matrixY[k] = product(k, set);
    }
    console.log(matrixToStringMn(matrixX));
    console.log(matrixToString(matrixY));
    console.log("matriz resultado");
    var result = solveSystemAB(matrixX, matrixY);
    return result;
}

function solveSystemMatrixExpanded(matrixExpanded) {
    return solveSystem(matrixExpanded.length, matrixExpanded);
}

/**
 * Recebe um sistema na forma de matriz nxn do lado esquerdo da igualdade e outra matriz do lado direito
 * e retorna uma matriz solução
 *
 *
 * @param matrixA
 * @param matrixB
 * @return MatrizSolução
 */
function solveSystemAB(matrixA, matrixB) {
    var n = matrixB.length;
    var matrixTemp = matrix(n, n + 1);

    //transporta os valores para a matriz espandida
    for (var x = 0; x < matrixA.length; x++) {
        for (var k = 0; k < n; k++) {
            matrixTemp[x][k] = matrixA[x][k];
        }
        matrixTemp[x][n] = matrixB[x];//�ltimo �ndice
    }

    return solveSystem(n, matrixTemp);
}

/**
 * recebe uma matriz expandida n+1 x n e retorna a matriz solução
 *
 * @param n
 * @param matrixExpanded
 * @return
 */
function solveSystem(n, matrixExpanded) {
    var result = new Array(n);
    var solved = false;
    var numLinha = 0;
    while (!solved) {

        var nLinha = 1;
        for (var numCol = 0; numCol < n - 1; numCol++) {
            for (nLinha = 1; nLinha < n; nLinha++) {
                processLine(numLinha, numCol, matrixExpanded, nLinha, n);
            }
            numLinha++;
        }
        solved = true;
    }
    console.log(matrixToStringMn(matrixExpanded));


    for (var r = n - 1; r >= 0; r--) {
        if (matrixExpanded[r][r] != 0.0) {
            var resultVal = 0.0;
            for (var l = r + 1; l < n; l++) {
                resultVal += matrixExpanded[r][l] * result[l];
            }
            result[r] = (matrixExpanded[r][n] - resultVal) / matrixExpanded[r][r];
        }
    }
    return result;
}

function processLine(numLinha, numCol, matrixTemp, nLinha, n) {
    if (numLinha + nLinha >= n) {
        return;
    }
    if (matrixTemp[numLinha][numCol] != 0 && matrixTemp[numLinha + nLinha][numCol] != 0) {

        var m = matrixTemp[numLinha + nLinha][numCol] / matrixTemp[numLinha][numCol];
        matrixTemp[numLinha + nLinha][numCol] = (m * matrixTemp[numLinha][numCol])
            - matrixTemp[numLinha + nLinha][numCol];
        for (var linha = 1; linha < n; linha++) {
            if (numCol + linha < n) {
                matrixTemp[numLinha + nLinha][numCol + linha] = (m * matrixTemp[numLinha][numCol + linha])
                    - matrixTemp[numLinha + nLinha][numCol + linha];
            }
        }
        matrixTemp[numLinha + nLinha][n] = (m * matrixTemp[numLinha][n]) - matrixTemp[numLinha + nLinha][n];
    }
}

function product(atPow, doubles) {
    var tot = 0.0;
    for (var e = 0; e < doubles.length; e++) {
        tot += Math.pow(doubles[e][0], atPow) * doubles[e][1];
    }

    return tot;
}

function sum(atPow, doubles) {
    var d = 0.0;
    for (var v in doubles) {
        d += Math.pow(doubles[v], atPow);
    }
    return d;
}


function getXfromMatrix(matrix) {
    let arr = new Array();
    for (let i in matrix) {
        arr.push(matrix[i][0]);
    }
    return arr;
}

function matrixToStringMn(mn) {

    var sb = "";
    for (var m in mn) {
        sb += ("|");
        sb += (matrixToString(mn[m]));
        sb += ("|\n");
    }


    return sb;

}

function matrixToString(m) {
    var sb = "";
    for (var n in m) {
        sb += ("\t\t" + m[n] + "\t\t");
    }

    return sb;
}

function matrixNM(n) {
    return matrix(n, n);
}
function matrix(n, m) {
    if (!m) {
        m = n;
    }
    let matrix = new Array(n);
    for (let i = 0; i < n; i++) {
        matrix[i] = new Array(m);
    }
    return matrix;
}

module.exports.findAproximation = findAproximation;