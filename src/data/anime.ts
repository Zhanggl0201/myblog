// 本地番剧数据配置
export type AnimeItem = {
	title: string;
	status: "watching" | "completed" | "planned";
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	studio: string;
	link: string;
	progress: number;
	totalEpisodes: number;
	startDate: string;
	endDate: string;
};

const localAnimeList: AnimeItem[] = [
	{
		title: "某科学的超电磁炮 T",
		status: "completed",
		rating: 9.8,
		cover: "https://www.imgur.la/images/2025/11/26/RailgunT.webp",
		description: "Girl's gunfight",
		episodes: "12 episodes",
		year: "2022",
		genre: ["Action", "Slice of life"],
		studio: "JC Staff",
		link: "https://www.bilibili.com/bangumi/play/ss29325?spm_id_from=333.1387.0.0",
		progress: 12,
		totalEpisodes: 12,
		startDate: "2022-07",
		endDate: "2022-09",
	},
	{
		title: "Lycoris Recoil",
		status: "completed",
		rating: 9.8,
		cover: "/assets/anime/lkls.webp",
		description: "Girl's gunfight",
		episodes: "12 episodes",
		year: "2022",
		genre: ["Action", "Slice of life"],
		studio: "A-1 Pictures",
		link: "https://www.bilibili.com/bangumi/media/md28338623",
		progress: 12,
		totalEpisodes: 12,
		startDate: "2022-07",
		endDate: "2022-09",
	},
	
];

export default localAnimeList;
