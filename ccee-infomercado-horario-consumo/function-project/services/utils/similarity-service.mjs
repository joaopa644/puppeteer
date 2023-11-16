import stringSimilarity from 'string-similarity';

export default class SimilarityService{
    static checkSimilarity(stringOne, stringTwo, similarityPercentage ){
        const similarity =  stringSimilarity.compareTwoStrings(stringOne.toUpperCase(), stringTwo.toUpperCase());

        if(similarity > similarityPercentage) return true;

        return false;
    }
}