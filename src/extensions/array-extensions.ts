interface Array<T> {
    clone(this: T[]): T[];
}

if (!Array.prototype.clone) {
    Array.prototype.clone = function<T>(this:T[]): T[] {
        return this.slice(0);
    }
}
