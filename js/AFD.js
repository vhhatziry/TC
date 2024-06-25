function esLetra(c) {
    return /[a-zA-Z]/.test(c);
  }
  
  function esDigito(c) {
    return /[0-9]/.test(c);
  }
  
  function esDigitoOctal(c) {
    return /[0-7]/.test(c);
  }
  
  function esHexadecimal(c) {
    return /[0-9a-fA-F]/.test(c);
  }
  
  function esOperador(c) {
    return /[\+\-\*\/\^\%]/.test(c);
  }
  
  const palabrasReservadas = [
    'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch',
    'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
    'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally',
    'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in',
    'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null',
    'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super',
    'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try',
    'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield',
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
    'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
    'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'null',
    'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
    'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try',
    'void', 'volatile', 'while',
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
    'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'inline',
    'int', 'long', 'register', 'restrict', 'return', 'short', 'signed', 'sizeof',
    'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile',
    'while', '_Alignas', '_Alignof', '_Atomic', '_Bool', '_Complex', '_Generic',
    '_Imaginary', '_Noreturn', '_Static_assert', '_Thread_local',
    'alignas', 'alignof', 'and', 'and_eq', 'asm', 'atomic_cancel', 'atomic_commit',
    'atomic_noexcept', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case', 'catch',
    'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept', 'const',
    'consteval', 'constexpr', 'constinit', 'const_cast', 'continue', 'co_await', 'co_return',
    'co_yield', 'decltype', 'default', 'delete', 'do', 'double', 'dynamic_cast', 'else',
    'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto',
    'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not',
    'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected', 'public',
    'reflexpr', 'register', 'reinterpret_cast', 'requires', 'return', 'short', 'signed',
    'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch', 'synchronized',
    'template', 'this', 'thread_local', 'throw', 'true', 'try', 'typedef', 'typeid',
    'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t',
    'while', 'xor', 'xor_eq'
  ];
  
  function automata(cadena) {
    let estado = 0;
    let i = 0;
    if (palabrasReservadas.includes(cadena)) return "X";
  
    while (i < cadena.length && estado >= 0) {
        const c = cadena[i];
  
        switch (estado) {
            case 0:
                if (esLetra(c) || c === '_') estado = 1;
                else if (esDigito(c) && c !== '0') estado = 3;
                else if (c === '0') estado = 4;
                else if (esOperador(c)) estado = 13;
                else if (c === '.') estado = 14;
                else if (c === ';') estado = 15;
                else if (c === '(') estado = 16;
                else if (c === ')') estado = 17;
                else if (c === '=') estado = 18;
                else estado = -1;
                break;
            case 1:
                if (esLetra(c) || esDigito(c) || c === '_') estado = 1;
                else estado = -1;
                break;
            case 3:
                if (esDigito(c)) estado = 3;
                else if (c === '.') estado = 5;
                else if (c.toLowerCase() === 'e') estado = 6;
                else estado = -1;
                break;
            case 4:
                if (esDigitoOctal(c)) estado = 7;
                else if (c.toLowerCase() === 'x') estado = 8;
                else if (c === '.') estado = 5;
                else estado = -1;
                break;
            case 5:
                if (esDigito(c)) estado = 12;
                else estado = -1;
                break;
            case 6:
                if (c === '+' || c === '-') estado = 9;
                else if (esDigito(c)) estado = 10;
                else estado = -1;
                break;
            case 7:
                if (esDigitoOctal(c)) estado = 7;
                else estado = -1;
                break;
            case 8:
                if (esHexadecimal(c)) estado = 11;
                else estado = -1;
                break;
            case 9:
                if (esDigito(c)) estado = 10;
                else estado = -1;
                break;
            case 10:
                if (esDigito(c)) estado = 10;
                else estado = -1;
                break;
            case 11:
                if (esHexadecimal(c)) estado = 11;
                else estado = -1;
                break;
            case 12:
                if (esDigito(c)) estado = 12;
                else if (c.toLowerCase() === 'e') estado = 6;
                else estado = -1;
                break;
            case 13:
                estado = -1;
                break;
            case 14:
                estado = -1;
                break;
            case 15:
                estado = -1;
                break;
            case 16:
                estado = -1;
                break;
            case 17:
                estado = -1;
                break;
            case 18:
                estado = -1;
                break;
        }
        i++;
    }
  
    if (estado < 0) {
        return "Inválida";
    } else {
        switch (estado) {
            case 1: return "identificador";
            case 3: return "constante numérica";
            case 4: return "constante numérica";
            case 7: return "constante numérica";
            case 5: return "Inválida";
            case 6: return "Inválida";
            case 8: return "Inválida";
            case 9: return "Inválida";
            case 12: return "constante numérica";
            case 10: return "constante numérica";
            case 11: return "constante numérica";
            case 13: return "Operador";
            case 14: return "Punto";
            case 15: return "Punto y coma";
            case 16: return "Paréntesis izquierdo";
            case 17: return "Paréntesis derecho";
            case 18: return "Igual";
            default: return "Inválida";
        }
    }
  }
  