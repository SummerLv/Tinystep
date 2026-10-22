/* Byte-mode QR codes as SVG. No dependencies.
   ISO/IEC 18004 block sizes are the numeric tables below. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TinyQR = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  // Version 1..40, levels L|M|Q|H. Each group is count.data.ecc.
  var ECC = (
    "1.19.7|1.16.10|1.13.13|1.9.17\n" +
    "1.34.10|1.28.16|1.22.22|1.16.28\n" +
    "1.55.15|1.44.26|2.17.18|2.13.22\n" +
    "1.80.20|2.32.18|2.24.26|4.9.16\n" +
    "1.108.26|2.43.24|2.15.18/2.16.18|2.11.22/2.12.22\n" +
    "2.68.18|4.27.16|4.19.24|4.15.28\n" +
    "2.78.20|4.31.18|2.14.18/4.15.18|4.13.26/1.14.26\n" +
    "2.97.24|2.38.22/2.39.22|4.18.22/2.19.22|4.14.26/2.15.26\n" +
    "2.116.30|3.36.22/2.37.22|4.16.20/4.17.20|4.12.24/4.13.24\n" +
    "2.68.18/2.69.18|4.43.26/1.44.26|6.19.24/2.20.24|6.15.28/2.16.28\n" +
    "4.81.20|1.50.30/4.51.30|4.22.28/4.23.28|3.12.24/8.13.24\n" +
    "2.92.24/2.93.24|6.36.22/2.37.22|4.20.26/6.21.26|7.14.28/4.15.28\n" +
    "4.107.26|8.37.22/1.38.22|8.20.24/4.21.24|12.11.22/4.12.22\n" +
    "3.115.30/1.116.30|4.40.24/5.41.24|11.16.20/5.17.20|11.12.24/5.13.24\n" +
    "5.87.22/1.88.22|5.41.24/5.42.24|5.24.30/7.25.30|11.12.24/7.13.24\n" +
    "5.98.24/1.99.24|7.45.28/3.46.28|15.19.24/2.20.24|3.15.30/13.16.30\n" +
    "1.107.28/5.108.28|10.46.28/1.47.28|1.22.28/15.23.28|2.14.28/17.15.28\n" +
    "5.120.30/1.121.30|9.43.26/4.44.26|17.22.28/1.23.28|2.14.28/19.15.28\n" +
    "3.113.28/4.114.28|3.44.26/11.45.26|17.21.26/4.22.26|9.13.26/16.14.26\n" +
    "3.107.28/5.108.28|3.41.26/13.42.26|15.24.30/5.25.30|15.15.28/10.16.28\n" +
    "4.116.28/4.117.28|17.42.26|17.22.28/6.23.28|19.16.30/6.17.30\n" +
    "2.111.28/7.112.28|17.46.28|7.24.30/16.25.30|34.13.24\n" +
    "4.121.30/5.122.30|4.47.28/14.48.28|11.24.30/14.25.30|16.15.30/14.16.30\n" +
    "6.117.30/4.118.30|6.45.28/14.46.28|11.24.30/16.25.30|30.16.30/2.17.30\n" +
    "8.106.26/4.107.26|8.47.28/13.48.28|7.24.30/22.25.30|22.15.30/13.16.30\n" +
    "10.114.28/2.115.28|19.46.28/4.47.28|28.22.28/6.23.28|33.16.30/4.17.30\n" +
    "8.122.30/4.123.30|22.45.28/3.46.28|8.23.30/26.24.30|12.15.30/28.16.30\n" +
    "3.117.30/10.118.30|3.45.28/23.46.28|4.24.30/31.25.30|11.15.30/31.16.30\n" +
    "7.116.30/7.117.30|21.45.28/7.46.28|1.23.30/37.24.30|19.15.30/26.16.30\n" +
    "5.115.30/10.116.30|19.47.28/10.48.28|15.24.30/25.25.30|23.15.30/25.16.30\n" +
    "13.115.30/3.116.30|2.46.28/29.47.28|42.24.30/1.25.30|23.15.30/28.16.30\n" +
    "17.115.30|10.46.28/23.47.28|10.24.30/35.25.30|19.15.30/35.16.30\n" +
    "17.115.30/1.116.30|14.46.28/21.47.28|29.24.30/19.25.30|11.15.30/46.16.30\n" +
    "13.115.30/6.116.30|14.46.28/23.47.28|44.24.30/7.25.30|59.16.30/1.17.30\n" +
    "12.121.30/7.122.30|12.47.28/26.48.28|39.24.30/14.25.30|22.15.30/41.16.30\n" +
    "6.121.30/14.122.30|6.47.28/34.48.28|46.24.30/10.25.30|2.15.30/64.16.30\n" +
    "17.122.30/4.123.30|29.46.28/14.47.28|49.24.30/10.25.30|24.15.30/46.16.30\n" +
    "4.122.30/18.123.30|13.46.28/32.47.28|48.24.30/14.25.30|42.15.30/32.16.30\n" +
    "20.117.30/4.118.30|40.47.28/7.48.28|43.24.30/22.25.30|10.15.30/67.16.30\n" +
    "19.118.30/6.119.30|18.47.28/31.48.28|34.24.30/34.25.30|20.15.30/61.16.30"
  ).split("\n").map(function (line) {
    return line.split("|").map(function (level) {
      return level.split("/").map(function (group) {
        var parts = group.split(".");
        return { count: +parts[0], data: +parts[1], ecc: +parts[2] };
      });
    });
  });

  // Center coordinates of alignment patterns. Version 1 has none.
  var ALIGN = [
    [],
    [],
    [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
    [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62],
    [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90],
    [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]
  ];

  var LEVELS = { L: 0, M: 1, Q: 2, H: 3 };
  // Format-info error-correction bits: L=01, M=00, Q=11, H=10.
  var FORMAT_ECC = [1, 0, 3, 2];

  function rsMultiply(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z & 0xff;
  }

  function rsDivisor(degree) {
    var result = new Uint8Array(degree);
    result[degree - 1] = 1;
    var root = 1;
    for (var i = 0; i < degree; i++) {
      for (var j = 0; j < result.length; j++) {
        result[j] = rsMultiply(result[j], root);
        if (j + 1 < result.length) result[j] ^= result[j + 1];
      }
      root = rsMultiply(root, 0x02);
    }
    return result;
  }

  function rsRemainder(data, degree) {
    var divisor = rsDivisor(degree);
    var result = new Uint8Array(divisor.length);
    for (var b = 0; b < data.length; b++) {
      var factor = data[b] ^ result[0];
      result.copyWithin(0, 1);
      result[result.length - 1] = 0;
      for (var i = 0; i < result.length; i++) result[i] ^= rsMultiply(divisor[i], factor);
    }
    return result;
  }

  function groupsFor(version, level) {
    return ECC[version - 1][level];
  }

  function dataBytes(version, level) {
    var groups = groupsFor(version, level);
    var n = 0;
    for (var i = 0; i < groups.length; i++) n += groups[i].count * groups[i].data;
    return n;
  }

  function byteCapacity(version, level) {
    var bits = dataBytes(version, level) * 8 - 4 - (version <= 9 ? 8 : 16);
    return bits < 0 ? 0 : Math.floor(bits / 8);
  }

  function utf8(text) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(String(text));
    var out = [];
    var s = String(text);
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
    return Uint8Array.from(out);
  }

  function choose(length, ecc) {
    var floor = LEVELS[ecc] == null ? LEVELS.M : LEVELS[ecc];
    var version = 0;
    for (var v = 1; v <= 40; v++) {
      if (byteCapacity(v, floor) >= length) { version = v; break; }
    }
    if (!version && floor !== LEVELS.L) {
      floor = LEVELS.L;
      for (var v2 = 1; v2 <= 40; v2++) {
        if (byteCapacity(v2, LEVELS.L) >= length) { version = v2; break; }
      }
    }
    if (!version) return null;
    // Prefer more error correction when it still fits this version.
    var rank = [LEVELS.H, LEVELS.Q, LEVELS.M, LEVELS.L];
    for (var r = 0; r < rank.length; r++) {
      if (byteCapacity(version, rank[r]) >= length) return { version: version, level: rank[r] };
    }
    return { version: version, level: floor };
  }

  function packData(bytes, version, level) {
    var total = dataBytes(version, level);
    var bits = [];
    function put(value, len) {
      for (var i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
    }
    put(0x4, 4);
    put(bytes.length, version <= 9 ? 8 : 16);
    for (var i = 0; i < bytes.length; i++) put(bytes[i], 8);
    var capacity = total * 8;
    var term = Math.min(4, capacity - bits.length);
    for (var t = 0; t < term; t++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var pads = [0xec, 0x11];
    var p = 0;
    while (bits.length < capacity) {
      put(pads[p], 8);
      p ^= 1;
    }
    var out = new Uint8Array(total);
    for (var c = 0; c < total; c++) {
      var value = 0;
      for (var b = 0; b < 8; b++) value = (value << 1) | bits[c * 8 + b];
      out[c] = value;
    }
    return out;
  }

  function interleave(data, version, level) {
    var groups = groupsFor(version, level);
    var blocks = [];
    var offset = 0;
    var maxData = 0;
    var eccLen = groups[0].ecc;
    for (var g = 0; g < groups.length; g++) {
      for (var n = 0; n < groups[g].count; n++) {
        var slice = data.subarray(offset, offset + groups[g].data);
        offset += groups[g].data;
        if (slice.length > maxData) maxData = slice.length;
        blocks.push({ data: slice, ecc: rsRemainder(slice, groups[g].ecc) });
      }
    }
    var out = [];
    for (var i = 0; i < maxData; i++) {
      for (var b = 0; b < blocks.length; b++) {
        if (i < blocks[b].data.length) out.push(blocks[b].data[i]);
      }
    }
    for (var e = 0; e < eccLen; e++) {
      for (var b2 = 0; b2 < blocks.length; b2++) out.push(blocks[b2].ecc[e]);
    }
    return Uint8Array.from(out);
  }

  function formatBits(level, mask) {
    var data = (FORMAT_ECC[level] << 3) | mask;
    var rem = data;
    for (var i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    return ((data << 10) | rem) ^ 0x5412;
  }

  function versionBits(version) {
    var rem = version;
    for (var i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    return (version << 12) | rem;
  }

  function maskFlips(mask, x, y) {
    switch (mask) {
      case 0: return ((x + y) & 1) === 0;
      case 1: return (y & 1) === 0;
      case 2: return x % 3 === 0;
      case 3: return (x + y) % 3 === 0;
      case 4: return ((Math.floor(y / 2) + Math.floor(x / 3)) & 1) === 0;
      case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
      case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
      default: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
    }
  }

  function build(bytes, version, level, fixedMask) {
    var size = 17 + 4 * version;
    var isFunction = [];
    var color = [];
    for (var y = 0; y < size; y++) {
      isFunction.push(new Uint8Array(size));
      color.push(new Uint8Array(size));
    }

    function setFn(x, y, dark) {
      isFunction[y][x] = 1;
      color[y][x] = dark ? 1 : 0;
    }

    function drawFinder(ox, oy) {
      for (var dy = -1; dy <= 7; dy++) {
        for (var dx = -1; dx <= 7; dx++) {
          var x = ox + dx;
          var y = oy + dy;
          if (x < 0 || y < 0 || x >= size || y >= size) continue;
          var on = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 &&
            (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
          setFn(x, y, on);
        }
      }
    }
    drawFinder(0, 0);
    drawFinder(size - 7, 0);
    drawFinder(0, size - 7);

    // Alignment is drawn before timing. Centers that sit on a finder are skipped;
    // centers on the timing row or column still get a pattern, and timing yields.
    var align = ALIGN[version];
    for (var a = 0; a < align.length; a++) {
      for (var b = 0; b < align.length; b++) {
        var cx = align[a];
        var cy = align[b];
        if (isFunction[cy][cx]) continue;
        for (var dy2 = -2; dy2 <= 2; dy2++) {
          for (var dx2 = -2; dx2 <= 2; dx2++) {
            var ax = Math.max(Math.abs(dx2), Math.abs(dy2));
            setFn(cx + dx2, cy + dy2, ax !== 1);
          }
        }
      }
    }

    for (var i = 8; i < size - 8; i++) {
      // Horizontal timing is row 6. Vertical timing is column 6.
      // Alignment patterns already on that line are left in place.
      if (!isFunction[6][i]) setFn(i, 6, (i & 1) === 0);
      if (!isFunction[i][6]) setFn(6, i, (i & 1) === 0);
    }

    setFn(8, size - 8, true);

    var formatAt = [];
    function reserveFormat(x, y, bit) {
      setFn(x, y, false);
      formatAt.push({ x: x, y: y, bit: bit });
    }
    for (var f = 0; f <= 5; f++) reserveFormat(8, f, f);
    reserveFormat(8, 7, 6);
    reserveFormat(8, 8, 7);
    reserveFormat(7, 8, 8);
    for (var f2 = 9; f2 < 15; f2++) reserveFormat(14 - f2, 8, f2);
    for (var f3 = 0; f3 < 8; f3++) reserveFormat(size - 1 - f3, 8, f3);
    for (var f4 = 8; f4 < 15; f4++) reserveFormat(8, size - 15 + f4, f4);

    if (version >= 7) {
      var vbits = versionBits(version);
      for (var vb = 0; vb < 18; vb++) {
        var on = ((vbits >>> vb) & 1) === 1;
        var vx = size - 11 + (vb % 3);
        var vy = Math.floor(vb / 3);
        setFn(vx, vy, on);
        setFn(vy, vx, on);
      }
    }

    var codewords = interleave(packData(bytes, version, level), version, level);
    var bitIndex = 0;
    var bitCount = codewords.length * 8;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) {
        for (var j = 0; j < 2; j++) {
          var x = right - j;
          var upward = ((right + 1) & 2) === 0;
          var y = upward ? size - 1 - vert : vert;
          if (!isFunction[y][x] && bitIndex < bitCount) {
            var byte = codewords[bitIndex >>> 3];
            color[y][x] = ((byte >>> (7 - (bitIndex & 7))) & 1);
            bitIndex++;
          }
        }
      }
    }

    function paint(mask) {
      var bits = formatBits(level, mask);
      for (var i = 0; i < formatAt.length; i++) {
        var spot = formatAt[i];
        color[spot.y][spot.x] = (bits >>> spot.bit) & 1;
      }
      var grid = [];
      for (var y = 0; y < size; y++) {
        var row = new Uint8Array(size);
        for (var x = 0; x < size; x++) {
          var dark = color[y][x];
          if (!isFunction[y][x] && maskFlips(mask, x, y)) dark ^= 1;
          row[x] = dark;
        }
        grid.push(row);
      }
      return grid;
    }

    function penalty(grid) {
      var result = 0;
      var hist = [0, 0, 0, 0, 0, 0, 0];
      function addHistory(run) {
        if (hist[0] === 0) run += size;
        hist.pop();
        hist.unshift(run);
      }
      function countPatterns() {
        var n = hist[1];
        var core = n > 0 && hist[2] === n && hist[3] === n * 3 && hist[4] === n && hist[5] === n;
        if (!core) return 0;
        if ((hist[0] >= n * 4 && hist[6] >= n) || (hist[6] >= n * 4 && hist[0] >= n)) return 1;
        return 0;
      }
      function scoreLine(line) {
        hist[0] = hist[1] = hist[2] = hist[3] = hist[4] = hist[5] = hist[6] = 0;
        var runColor = 0;
        var run = 0;
        var score = 0;
        for (var i = 0; i < size; i++) {
          if (line[i] === runColor) {
            run++;
            if (run === 5) score += 3;
            else if (run > 5) score++;
          } else {
            addHistory(run);
            if (!runColor) score += countPatterns() * 40;
            runColor = line[i];
            run = 1;
          }
        }
        if (runColor) {
          addHistory(run);
          run = 0;
        }
        run += size;
        addHistory(run);
        score += countPatterns() * 40;
        return score;
      }
      for (var y = 0; y < size; y++) result += scoreLine(grid[y]);
      var col = new Uint8Array(size);
      for (var x = 0; x < size; x++) {
        for (var y2 = 0; y2 < size; y2++) col[y2] = grid[y2][x];
        result += scoreLine(col);
      }
      for (var y3 = 0; y3 < size - 1; y3++) {
        for (var x2 = 0; x2 < size - 1; x2++) {
          var c = grid[y3][x2];
          if (c === grid[y3][x2 + 1] && c === grid[y3 + 1][x2] && c === grid[y3 + 1][x2 + 1]) result += 3;
        }
      }
      var dark = 0;
      for (var y4 = 0; y4 < size; y4++) {
        for (var x3 = 0; x3 < size; x3++) dark += grid[y4][x3];
      }
      var total = size * size;
      var k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
      result += k * 10;
      return result;
    }

    var mask = fixedMask;
    if (mask == null) {
      var best = 0;
      var bestScore = Infinity;
      for (var m = 0; m < 8; m++) {
        var score = penalty(paint(m));
        if (score < bestScore) {
          bestScore = score;
          best = m;
        }
      }
      mask = best;
    }
    return { grid: paint(mask), mask: mask, version: version, level: level, size: size };
  }

  function matrix(text, options) {
    var opts = options || {};
    var bytes = utf8(text);
    var picked = opts.version
      ? { version: opts.version, level: LEVELS[opts.ecc || "M"] }
      : choose(bytes.length, opts.ecc || "M");
    if (!picked) {
      var error = new Error("QR payload is too long");
      error.code = "TOO_LONG";
      throw error;
    }
    var built = build(bytes, picked.version, picked.level, opts.mask == null ? null : opts.mask);
    var grid = [];
    for (var y = 0; y < built.size; y++) grid.push(Array.from(built.grid[y]));
    grid.version = built.version;
    grid.mask = built.mask;
    grid.ecc = "LMQH"[built.level];
    return grid;
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function svg(text, options) {
    var opts = options || {};
    var grid = matrix(text, opts);
    var quiet = opts.quiet == null ? 4 : opts.quiet;
    var n = grid.length + quiet * 2;
    var d = "";
    for (var y = 0; y < grid.length; y++) {
      var x = 0;
      var row = grid[y];
      while (x < row.length) {
        if (!row[x]) { x++; continue; }
        var x2 = x + 1;
        while (x2 < row.length && row[x2]) x2++;
        var w = x2 - x;
        d += "M" + (x + quiet) + " " + (y + quiet) + "h" + w + "v1h" + (-w) + "z";
        x = x2;
      }
    }
    var label = escapeXml(opts.label || "QR code");
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + " " + n +
      '" role="img" aria-label="' + label + '" shape-rendering="crispEdges">' +
      '<rect width="' + n + '" height="' + n + '" fill="#fff"/>' +
      '<path fill="#111" d="' + d + '"/></svg>';
  }

  return { matrix: matrix, svg: svg };
});
