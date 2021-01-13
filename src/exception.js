"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.ValidationException = exports.ClientException = exports.ServerException = exports.HTTPException = void 0;
var HTTPException = /** @class */ (function () {
    function HTTPException() {
    }
    HTTPException.prototype.json = function () {
        return __assign({ status_code: this.status_code() }, this.description());
    };
    HTTPException.prototype.toString = function () {
        return "HTTPException " + this.status_code() + " - " + this.description().message;
    };
    return HTTPException;
}());
exports.HTTPException = HTTPException;
var ServerException = /** @class */ (function (_super) {
    __extends(ServerException, _super);
    function ServerException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerException.prototype.status_code = function () {
        return 500;
    };
    ServerException.prototype.description = function () {
        return {
            message: "Internal server error."
        };
    };
    return ServerException;
}(HTTPException));
exports.ServerException = ServerException;
var ClientException = /** @class */ (function (_super) {
    __extends(ClientException, _super);
    function ClientException(message, status_code) {
        if (status_code === void 0) { status_code = 400; }
        var _this = _super.call(this) || this;
        _this.message = message;
        _this._status_code = status_code;
        return _this;
    }
    ClientException.prototype.status_code = function () {
        return this._status_code;
    };
    ClientException.prototype.description = function () {
        return {
            message: this.message
        };
    };
    return ClientException;
}(HTTPException));
exports.ClientException = ClientException;
var ValidationException = /** @class */ (function (_super) {
    __extends(ValidationException, _super);
    function ValidationException(result) {
        var _this = _super.call(this, "Validation Error") || this;
        _this.result = result;
        return _this;
    }
    ValidationException.prototype.description = function () {
        return __assign(__assign({}, _super.prototype.description.call(this)), { errors: this.result.errors.map(function (error) { return error.toString(); }) });
    };
    return ValidationException;
}(ClientException));
exports.ValidationException = ValidationException;
