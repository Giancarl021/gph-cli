module.exports = {
    askUntil(validator, callback, ...args) {
        let first = true;
        let r;
        do {
            if(!first) console.log('Invalid input!');
            r = callback(...args);
            first = false;
        } while(!validator(r));
        return r;
    },
    
    tryUntil(validator, callback, ...args) {
        let first = true;
        let r, err;
        do {
            if(!first) console.log('Invalid input!');
            try {
                r = callback(...args);
                err = null;
                if(!validator ? false : !validator(r)) throw new Error('Validator Error');
            } catch (e) {
                err = e;
            }
            first = false;
        } while(err);
    
        return r;
    }
};