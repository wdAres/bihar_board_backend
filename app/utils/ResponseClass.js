class ResponseClass {
    constructor(message, code, data) {
        this.message = message;
        this.code = code;
        this.success = true;
        this.data = data;
    }

    send(res) {
        return res.status(this.code).json({
            code: this.code,
            message: this.message,
            data: this.data,
            success: this.success
        });
    }
}

module.exports = ResponseClass;