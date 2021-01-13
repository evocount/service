"use strict";
exports.__esModule = true;
var winston_1 = require("winston");
exports["default"] = (function (settings) { return winston_1["default"].createLogger({
    level: settings.level,
    transports: [
        new winston_1["default"].transports.Console({
            format: winston_1["default"].format.combine(winston_1["default"].format.colorize(), winston_1["default"].format.simple())
        })
    ]
}); });
