import tf from '@tensorflow/tfjs-node';

class MovieRecommender {
    private model: tf.LayersModel;
    private userIdToIndex: Map<number, number>;
    private movieIdToIndex: Map<number, number>;

    constructor(userIds: number[], movieIds: number[], embeddingDim = 50) {
        // Create ID to index mappings
        this.userIdToIndex = new Map(userIds.map((id, index) => [id, index]));
        this.movieIdToIndex = new Map(movieIds.map((id, index) => [id, index]));

        const numUsers = this.userIdToIndex.size;
        const numMovies = this.movieIdToIndex.size;

        // Create input layers
        const userInput = tf.input({shape: [1]});
        const movieInput = tf.input({shape: [1]});

        // Create embedding layers
        const userEmbedding = tf.layers.embedding({
            inputDim: numUsers,
            outputDim: embeddingDim,
            inputLength: 1
        }).apply(userInput);

        const movieEmbedding = tf.layers.embedding({
            inputDim: numMovies,
            outputDim: embeddingDim,
            inputLength: 1
        }).apply(movieInput);

        // Flatten embeddings
        const userFlat = tf.layers.flatten().apply(userEmbedding) as tf.SymbolicTensor;
        const movieFlat = tf.layers.flatten().apply(movieEmbedding) as tf.SymbolicTensor;

        // Concatenate embeddings
        const concat = tf.layers.concatenate().apply([userFlat, movieFlat]);

        // Add dense layers
        const dense = tf.layers.dense({units: 1, activation: 'sigmoid'}).apply(concat) as tf.SymbolicTensor;

        // Create model
        this.model = tf.model({
            inputs: [userInput, movieInput],
            outputs: dense
        });

        this.model.compile({
            optimizer: 'adam',
            loss: 'meanSquaredError'
        });
    }

    async train(userIds: number[], movieIds: number[], ratings: number[], epochs = 50) {
        // Map IDs to indices with validation
        const mappedUserIds = userIds.map(id => {
            const index = this.userIdToIndex.get(id);
            if (index === undefined) {
                throw new Error(`Invalid user ID: ${id}`);
            }
            return index;
        });

        const mappedMovieIds = movieIds.map(id => {
            const index = this.movieIdToIndex.get(id);
            if (index === undefined) {
                throw new Error(`Invalid movie ID: ${id}`);
            }
            return index;
        });

        const xs = [
            tf.tensor2d(mappedUserIds, [mappedUserIds.length, 1]),
            tf.tensor2d(mappedMovieIds, [mappedMovieIds.length, 1])
        ];
        const ys = tf.tensor2d(ratings, [ratings.length, 1]);

        await this.model.fit(xs, ys, {
            epochs: epochs,
            batchSize: 32,
            validationSplit: 0.1,
            verbose: 1
        });
    }

    predict(userId: number, movieId: number): number {
        return tf.tidy(() => {
            const userIndex = this.userIdToIndex.get(userId)!;
            const movieIndex = this.movieIdToIndex.get(movieId)!;
            
            const prediction = this.model.predict([
                tf.tensor2d([userIndex], [1, 1]),
                tf.tensor2d([movieIndex], [1, 1])
            ]) as tf.Tensor;
            return prediction.dataSync()[0];
        });
    }

    async saveModel(path: string) {
        const result = await this.model.save(`file://${path}`);
    }

    async loadModel(path: string) {
        this.model = tf.sequential({ layers: (await tf.loadLayersModel(`file://${path}`)).layers });
    }
}

export { MovieRecommender };