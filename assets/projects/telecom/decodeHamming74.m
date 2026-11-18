function msg_final = decodeHamming74(bits)
    bits = bits(14:end);
    L = length(bits);
    excess = mod(L,7);
    if excess ~= 0
        bits = bits(1:end-excess);
    end
    bits7 = reshape(bits,7,[])';
    decoded = decode(bits7, 7, 4, 'hamming');
    msg_final = reshape(decoded.',1,[]);
end
