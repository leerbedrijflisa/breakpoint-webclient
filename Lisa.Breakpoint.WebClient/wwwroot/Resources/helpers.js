export class Helpers {

    capitalize(string)
    {
        // This would send undefined for empty strings
        // return s[0].toUpperCase() + s.slice(1);

        return string && string[0].toUpperCase() + string.slice(1);
    }
}
