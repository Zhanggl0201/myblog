// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Xiaomi: [
		{
			name: "Xiaomi 15",
			image: "/images/device/xiaomi15.png",
			specs: "Gray / 12G + 256GB",
			description: "小米 徕卡 联合研发",
			link: "https://www.mi.com/prod/xiaomi-15",
		},
	],
	ROG: [
		{
			name: "ROG FLOW Z13 2025",
			image: "/images/device/FLOW2025.png",
			specs: "AMD RYZEN AI MAX+ 395",
			description:
				"AMD RYZEN AI MAX+ 395",
			link: "https://rog.asus.com.cn/laptops/rog-flow/rog-flow-z13-2025/",
		},
	],
};
