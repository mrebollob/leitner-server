// from https://ncase.me/remember/sims/leitner/leitner.js
const CALENDAR = [
    [2, 1],
    [3, 1],
    [2, 1],
    [4, 1],
    [2, 1],
    [3, 1],
    [2, 1],
    [1],
    [2, 1],
    [3, 1],
    [2, 1],
    [5, 1],
    [4, 2, 1],
    [3, 1],
    [2, 1],
    [1],
    [2, 1],
    [3, 1],
    [2, 1],
    [4, 1],
    [2, 1],
    [3, 1],
    [2, 1],
    [6, 1],
    [2, 1],
    [3, 1],
    [2, 1],
    [5, 1],
    [4, 2, 1],
    [3, 1],
    [2, 1],
    [1],
    [2, 1],
    [3, 1],
    [2, 1],
    [4, 1],
    [2, 1],
    [3, 1],
    [2, 1],
    [1],
    [2, 1],
    [3, 1],
    [2, 1],
    [5, 1],
    [4, 2, 1],
    [3, 1],
    [2, 1],
    [1],
    [2, 1],
    [3, 1],
    [2, 1],
    [4, 1],
    [2, 1],
    [3, 1],
    [2, 1],
    [7, 1],
    [2, 1],
    [3, 1],
    [6, 2, 1],
    [5, 1],
    [4, 2, 1],
    [3, 1],
    [2, 1],
    [1],
];

export function index(req, res) {

    var day = Number.parseInt(req.params.dayNumber);

    if (Number.isInteger(day)) {
        var d = (day - 1) % CALENDAR.length;

        return res.json({
            day: day,
            levels: CALENDAR[d]
        });
    } else {
        return res.status(400).send({
            error: `value not valid: ${req.params.dayNumber}`,
        });
    }
}