export default class DateFunction {

    static standard(d) {
        return `${d.getFullYear()}-${DateFunction.numbers(d.getMonth()+1)}-${DateFunction.numbers(d.getDate())}`;
    }

    static numbers(n) {
        return n<10 ? `0${n}` : n;
    }
}