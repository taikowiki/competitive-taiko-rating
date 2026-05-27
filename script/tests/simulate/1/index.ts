import glicko2 from 'glicko2-lite';

const a = {
    rating: 2000,
    RD: 350,
    Vol: 0.6
}

const b = {
    rating: 1000,
    RD: 350,
    Vol: 0.6
}

const c = {
    rating: 1900,
    RD: 350,
    Vol: 0.6
}

console.log(glicko2(a.rating, a.RD, a.Vol, [
    [b.rating, b.RD, 0.5]
]));
console.log(glicko2(a.rating, a.RD, a.Vol, [
    [b.rating, b.RD, 0.6]
]));
console.log(glicko2(a.rating, a.RD, a.Vol, [
    [b.rating, b.RD, 0.7]
]));
console.log(glicko2(a.rating, a.RD, a.Vol, [
    [b.rating, b.RD, 0.8]
]));
console.log(glicko2(a.rating, a.RD, a.Vol, [
    [b.rating, b.RD, 0.9]
]))
console.log(glicko2(a.rating, a.RD, a.Vol, [
    [b.rating, b.RD, 1]
]))
console.log(glicko2(a.rating, a.RD, a.Vol, [
    [b.rating, b.RD, 0.6],
    [b.rating, b.RD, 0.6]
]))
console.log('--------------------------------------')
console.log(glicko2(a.rating, a.RD, a.Vol, [
    [c.rating, c.RD, 0.6]
]))