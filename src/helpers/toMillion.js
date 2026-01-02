function toMillions(population) {
    return Math.round((population / 1_000_000) * 10) / 10; // 1 decimaal
}

export {toMillions};

