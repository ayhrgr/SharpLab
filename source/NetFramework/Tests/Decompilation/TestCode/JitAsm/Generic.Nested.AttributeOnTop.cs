using SharpLab.Runtime;

[JitGeneric(typeof(int))]
[JitGeneric(typeof(string))]
static class C<T> {
    static class N {
        static T M() => default(T);
    }
}

/* asm

; Desktop CLR <IGNORE> on amd64

C`1+N[[System.Int32, mscorlib]].M()
    L0000: xor eax, eax
    L0002: ret

C`1+N[[System.__Canon, mscorlib]].M()
    L0000: xor eax, eax
    L0002: ret

*/