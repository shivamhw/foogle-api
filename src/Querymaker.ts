import { MovieSearchQueryParams, SeriesSearchQueryParams } from "./types";


let file_type = { "video": "mimeType contains \'video/\'" };
const sep = [" ", ".", "", "_"]
export function get_movie_query(query: MovieSearchQueryParams) {
    let queries: string[] = [];
    let possible_terms = [];
    if (query.movie_name.split(" ").length !== 1) {
        possible_terms.push(query.movie_name.toLowerCase());
    } else {
        queries.push(`name contains \'${query.movie_name.toLowerCase()}\' and ${file_type['video']}`)
    }
    if (query.movie_rel_year !== "") {
        possible_terms.push(query.movie_name.toLowerCase() + " " + query.movie_rel_year);
    }
    possible_terms.map((term) => {
        sep.map((s) => {
            queries.push(
                `name contains \'${term.split(" ").join(s)}\' and ${file_type['video']}`);
        });
    });
    return queries;
}

export function get_file_query(filename: string) {
    let queries: string[] = [];
    let possible_terms = [];
    if (filename.split(" ").length !== 1) {
        possible_terms.push(filename.toLowerCase());
    } else {
        queries.push(`name contains \'${filename.toLowerCase()}\'`)
    }
    possible_terms.map((term) => {
        sep.map((s) => {
            queries.push(
                `name contains \'${term.split(" ").join(s)}\'`);
        });
    });
    return queries;
}

export function get_series_query(params: SeriesSearchQueryParams) {
    //TODO: sanitization
    let queries = [
        // `name contains \'${params.name.split(" ").join(".")}.${params.season}.${params.episode}\'`,
        `name contains \'${params.name} s${params.season}e${params.episode}\' and ${file_type['video']}`,
        `name contains \'${params.name} s${params.season} e${params.episode}\' and ${file_type['video']}`,
        `name contains \'${params.name} s${params.season} ep${params.episode}\' and ${file_type['video']}`,
        `name contains \'${params.name} s${params.season}ep${params.episode}\' and ${file_type['video']}`,
        `name contains \'${params.name} s${params.season}\' and ${file_type['video']}`,
        `name contains \'${params.name} season ${params.season}\' and ${file_type['video']}`,
        `name contains \'${params.name}\'`]
    return queries
}
// @classmethod
// def series_querymaker(cls, series: SeriesSearchRequest, sep=".") -> List[str]:
//     series.series_name = Utils.sanitize(series.series_name)
//     alternate_q = [f"name contains '{ sep.join(series.series_name.split()) }{sep}s{series.season_nm}e{series.episode_nm}'",
//                    f"name contains '{ sep.join(series.series_name.split()) }{sep}s{series.season_nm}ep{series.episode_nm}'",
//                    f"name contains '{ sep.join(series.series_name.split()) }{sep}s{series.season_nm}{sep}e{series.episode_nm}'",
//                    f"name contains '{ sep.join(series.series_name.split()) }{sep}s{series.season_nm}{sep}ep{series.episode_nm}'",
//                    f"name contains '{series.series_name} s{series.season_nm}e{series.episode_nm}'",
//                    f"name contains '{series.series_name} s{series.season_nm} e{series.episode_nm}'",
//                    f"name contains '{series.series_name} s{series.season_nm} ep{series.episode_nm}'",
//                    f"name contains '{series.series_name} s{series.season_nm}ep{series.episode_nm}'",
//                    f"name contains '{series.series_name} s{series.season_nm}'",
//                    f"name contains '{series.series_name} season {series.season_nm}'",
//                    f"name contains '{series.series_name}'"]
//     for ind, val in enumerate(alternate_q):
//         alternate_q[ind] = val + " and " + cls.file_type["video"]
//     return alternate_q

// @classmethod
// def files_querymaker(self, query):
//     return [f"name contains '{query}'"]


// let q = new QueryMaker()
console.log(get_series_query({
    name: "friends",
    season: "01",
    episode: "04"
}))