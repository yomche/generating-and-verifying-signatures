// Библиотека для работы с консолью
const io = require('console-read-write');

// Параметры эллиптической кривой
let p = 751;
let a = -1;
let b = 1;

// Функция проверки подписи
async function check() {
    console.log(' H = ');
    let h = Number(await io.read());
    console.log(' RS.x = ');
    let rs_x = Number(await io.read());
    console.log(' RS.y = ');
    let rs_y = Number(await io.read());
    let rs = new Point (rs_x, rs_y);
    console.log(' q.x = ');
    let q_x = Number(await io.read());
    console.log(' q.y = ');
    let q_y = Number(await io.read());
    let Q = new Point(q_x, q_y);
    let q = 13;
    let g = new Point(562, 89);
    console.log(`G: (${g.x},${g.y})`);

    if(rs.x >= 1 && rs.x <= q - 1 && rs.y >= 1 && rs.y <= q - 1) {
        let v = mod(inverse(rs.y, q), q);
        console.log(`V: ${v}`);

        let u1 = mod(v * h, q);
        console.log(`u1: ${u1}`);

        let u2 = mod(v * rs.x, q);
        console.log(`u2 ${u2}`);

        let u1g = multiplication(u1, g);
        console.log(`u1g: (${u1g.x},${u1g.y})`);

        let u2q = multiplication(u2, Q);
        console.log(`u2g: (${u2q.x}, ${u2q.y})`);

        let x = sum(u1g, u2q);
        console.log(`x: (${x.x},${x.y})`);

        if(rs.x == mod(x.x, q)) {
            console.log("Original sign");
        }
        else { 
            console.log('Fake sign');
        }
    } else { 
        console.log('Fake sign');
    }
}

// Класс Точка
class Point { 
    constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    
}

// Функция взятия остатка по модулю
function mod (a_param, b_param) { 
    while (a_param < 0) { 
        a_param += b_param;
    }
    return a_param%b_param;
}

// Функция поиска обратного числа
function inverse(a_param, b_param) { 
    for (let i = 1; i < b_param; i++) { 
        if (mod(a_param*i, b_param) == 1) { 
            return i;
        }
    }
}

// Функция произведения двух точек ( произведение считается через суммирование)
function multiplication(a_param, b_param) { 
    let param = new Point(0, 0);
    for (let i = 1; i <= a_param; i++) { 
        param = sum(b_param, param);
    }
    return param;
}

// Функция суммирования двух точек
function sum(a_param, b_param) {
    if (b_param.x == 0 && b_param.y == 0){ 
        return a_param;
    }
    if (a_param.x == b_param.x) { 
        let lambda = mod(lambdaForEqual(a_param.x, a_param.y), p);
        let x = mod(lambda * lambda - 2 * a_param.x, p);
        let y = mod(lambda * (a_param.x - x) - a_param.y, p);
        return new Point(x, y);
    } else { 
        let lambda = mod(lambdaForDifferent(a_param.x, a_param.y, b_param.x, b_param.y), p);
        let x = mod(lambda * lambda - a_param.x - b_param.x, p);
        let y = mod(lambda * (a_param.x - x) - a_param.y, p);
        return new Point(x, y);
    }

}

// Функция вычисления лямбды при суммировании одинаковых точек
function lambdaForEqual(x_param, y_param) {
    let multiplicator = y_param < 0 ? -1 : 1;
    let num = multiplicator * ( 3 * x_param * x_param + a);
    let denom = multiplicator * 2 * y_param;
    return mod(num * inverse(denom, p), p); 
}

// Функция вычисления лямбды при суммировании разных точек
function lambdaForDifferent(x1_param, y1_param, x2_param, y2_param) {
    let multiplicator = (x2_param - x1_param) < 0 ? -1 : 1;
    let num = multiplicator * (y2_param - y1_param);
    let denom = multiplicator * (x2_param - x1_param);
    return mod(num * inverse(denom, p), p); 
}

// Вызов функции проверки подписи
check();