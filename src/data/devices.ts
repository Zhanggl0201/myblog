// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	descriptionHtml?: string; // 可选字段，专门用于HTML内容
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Phone: [
		{
			name: "Xiaomi 15",
			image: "/images/device/xiaomi15.png",
			specs: "￥3999",
			description: "小米 徕卡 联合研发 12G + 256GB",
			descriptionHtml: "小米 徕卡 联合研发 <br> 12G + 256GB",
			link: "https://www.mi.com/prod/xiaomi-15",
		},
	],
	PC: [
		{
			name: "ROG FLOW Z13 2025",
			image: "/images/device/FLOW2025.png",
			specs: "￥14999",
			description:
				"AMD RYZEN AI MAX+ 395w/ Radeon 8060S 32G + 1T",
			link: "https://rog.asus.com.cn/laptops/rog-flow/rog-flow-z13-2025/",
		},
	],
	Keyboard: [
		{
			name: "Colorful QY98 Pro",
			image: "https://youke1.picui.cn/s1/2025/11/26/6926673c89b78.png",
			specs: "￥299",
			description:
				"紫绡 幻瞳轴",
			link: "https://item.jd.com/100266843052.html?cu=true&utm_source=lianmeng__10__www.ithome.com&utm_medium=jingfen&utm_campaign=t_236375426_RV_mtanmuLotQ184MTM4NQ&utm_term=809442ff57b8402cb7c486268080a523",
		},
	],
};
