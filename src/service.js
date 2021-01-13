"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Service = void 0;
var express_1 = require("express");
var morgan_1 = require("morgan");
var body_parser_1 = require("body-parser");
var logger_1 = require("./logger");
var settings_1 = require("./settings");
var exception_1 = require("./exception");
var exception_2 = require("./exception");
var Service = /** @class */ (function () {
    function Service(name) {
        this.routes = [];
        this.name = name;
    }
    Service.prototype.add_route = function (route) {
        this.routes.push(route.to_express());
    };
    Service.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings, logger, app, _i, _a, route;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, settings_1.load(this.name)];
                    case 1:
                        settings = _b.sent();
                        logger = logger_1["default"](settings.get_logger());
                        app = express_1["default"]();
                        app.use(morgan_1["default"]("combined", {
                            skip: function (request) { return (request.statusCode || 200) > 400; },
                            stream: {
                                write: function (message) { return logger.info(message); }
                            }
                        }));
                        app.use(morgan_1["default"]("combined", {
                            skip: function (request) { return (request.statusCode || 200) < 400; },
                            stream: {
                                write: function (message) { return logger.error(message); }
                            }
                        }));
                        app.use(body_parser_1["default"].json());
                        for (_i = 0, _a = this.routes; _i < _a.length; _i++) {
                            route = _a[_i];
                            app.use(route);
                        }
                        //error handler
                        app.use(function (error, request, response) {
                            logger.error(error);
                            var http_error = error instanceof exception_1.HTTPException ? error : new exception_2.ServerException;
                            response.status(http_error.status_code());
                            response.json(http_error.json());
                        });
                        app.listen(settings.get_server().port);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Service;
}());
exports.Service = Service;
