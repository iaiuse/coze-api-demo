"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { marked } from 'marked';

// 首先定义一个类型来描述 CHINA_REGIONS 对象的结构
type ChineseRegions = {
  "北京": string[];
  "上海": string[];
  "广东": string[];
  "浙江": string[];
  "天津": string[];
  "河北": string[];
  "山西": string[];
  "内蒙古": string[];
  "辽宁": string[];
  "吉林": string[];
  "黑龙江": string[];
  "江苏": string[];
  "安徽": string[];
  "福建": string[];
  "江西": string[];
  "山东": string[];
  "河南": string[];
  "湖北": string[];
  "湖南": string[];
  "海南": string[];
  "重庆": string[];
  "四川": string[];
  "贵州": string[];
  "云南": string[];
  "西藏": string[];
  "陕西": string[];
  "甘肃": string[];
  "青海": string[];
  "宁夏": string[];
  "新疆": string[];
  "香港": string[];
  "澳门": string[];
  "台湾": string[];
  "南海诸岛": string[];
  "钓鱼岛": string[];
  "黄岩岛": string[];
  "赤尾屿": string[];
  "南沙群岛": string[];
  "中沙群岛": string[];
  "西沙群岛": string[];
  "东沙群岛": string[];
}

const CHINA_REGIONS: ChineseRegions = {
  "北京": ["北京"],
  "天津": ["天津"],
  "河北": ["石家庄", "唐山", "秦皇岛", "邯郸", "邢台", "保定", "张家口", "承德", "沧州", "廊坊", "衡水"],
  "山西": ["太原", "大同", "阳泉", "长治", "晋城", "朔州", "晋中", "运城", "忻州", "临汾", "吕梁"],
  "内蒙古": ["呼和浩特", "包头", "乌海", "赤峰", "通辽", "鄂尔多斯", "呼伦贝尔", "巴彦淖尔", "乌兰察布", "兴安盟", "锡林郭勒盟", "阿拉善盟"],
  "辽宁": ["沈阳", "大连", "鞍山", "抚顺", "本溪", "丹东", "锦州", "营口", "阜新", "辽阳", "盘锦", "铁岭", "朝阳", "葫芦岛"],
  "吉林": ["长春", "吉林", "四平", "辽源", "通化", "白山", "松原", "白城", "延边"],
  "黑龙江": ["哈尔滨", "齐齐哈尔", "鸡西", "鹤岗", "双鸭山", "大庆", "伊春", "佳木斯", "七台河", "牡丹江", "黑河", "绥化", "大兴安岭"],
  "上海": ["上海"],
  "江苏": ["南京", "无锡", "徐州", "常州", "苏州", "南通", "连云港", "淮安", "盐城", "扬州", "镇江", "泰州", "宿迁"],
  "浙江": ["杭州", "宁波", "温州", "嘉兴", "湖州", "绍兴", "金华", "衢州", "舟山", "台州", "丽水"],
  "安徽": ["合肥", "芜湖", "蚌埠", "淮南", "马鞍山", "淮北", "铜陵", "安庆", "黄山", "滁州", "阜阳", "宿州", "六安", "亳州", "池州", "宣城"],
  "福建": ["福州", "厦门", "莆田", "三明", "泉州", "漳州", "南平", "龙岩", "宁德"],
  "江西": ["南昌", "景德镇", "萍乡", "九江", "新余", "鹰潭", "赣州", "吉安", "宜春", "抚州", "上饶"],
  "山东": ["济南", "青岛", "淄博", "枣庄", "东营", "烟台", "潍坊", "济宁", "泰安", "威海", "日照", "临沂", "德州", "聊城", "滨州", "菏泽"],
  "河南": ["郑州", "开封", "洛阳", "平顶山", "安阳", "鹤壁", "新乡", "焦作", "濮阳", "许昌", "漯河", "三门峡", "南阳", "商丘", "信阳", "周口", "驻马店"],
  "湖北": ["武汉", "黄石", "十堰", "宜昌", "襄阳", "鄂州", "荆门", "孝感", "荆州", "黄冈", "咸宁", "随州", "恩施", "仙桃", "潜江", "天门", "神农架"],
  "湖南": ["长沙", "株洲", "湘潭", "衡阳", "邵阳", "岳阳", "常德", "张家界", "益阳", "郴州", "永州", "怀化", "娄底", "湘西"],
  "广东": ["广州", "深圳", "珠海", "汕头", "韶关", "佛山", "江门", "湛江", "茂名", "肇庆", "惠州", "梅州", "汕尾", "河源", "阳江", "清远", "东莞", "中山", "潮州", "揭阳", "云浮"],
  "海南": ["海口", "三亚", "三沙", "五指山", "琼海", "儋州", "文昌", "万宁", "东方", "定安", "屯昌", "澄迈", "临高", "白沙", "昌江", "乐东", "陵水", "保亭", "琼中"],
  "重庆": ["重庆"],
  "四川": ["成都", "自贡", "攀枝花", "泸州", "德阳", "绵阳", "广元", "遂宁", "内江", "乐山", "南充", "眉山", "宜宾", "广安", "达州", "雅安", "巴中", "资阳", "阿坝", "甘孜", "凉山"],
  "贵州": ["贵阳", "六盘水", "遵义", "安顺", "毕节", "铜仁", "黔西南", "黔东南", "黔南"],
  "云南": ["昆明", "曲靖", "玉溪", "保山", "昭通", "丽江", "普洱", "临沧", "楚雄", "红河", "文山", "西双版纳", "大理", "德宏", "怒江", "迪庆"],
  "西藏": ["拉萨", "日喀则", "昌都", "林芝", "山南", "那曲", "阿里"],
  "陕西": ["西安", "宝鸡", "咸阳", "铜川", "渭南", "延安", "汉中", "榆林", "安康", "商洛"],
  "甘肃": ["兰州", "嘉峪关", "金昌", "白银", "天水", "武威", "张掖", "平凉", "酒泉", "庆阳", "定西", "陇南", "临夏", "甘南"],
  "青海": ["西宁", "海东", "海北", "黄南", "海南", "果洛", "玉树", "海西"],
  "宁夏": ["银川", "石嘴山", "吴忠", "固原", "中卫"],
  "新疆": ["乌鲁木齐", "克拉玛依", "吐鲁番", "哈密", "昌吉", "博尔塔拉", "巴音郭楞", "阿克苏", "克孜勒苏", "喀什", "和田", "伊犁", "塔城", "阿勒泰"], 
  "香港": ["香港"],
  "澳门": ["澳门"],
  "台湾": ["台北", "新北", "桃园", "台中", "台南", "高雄", "基隆", "新竹", "嘉义", "云林", "宜兰", "花莲", "屏东", "台东", "澎湖", "金门", "连江"],
  "南海诸岛": ["南沙群岛", "中沙群岛", "西沙群岛", "东沙群岛"],
  "钓鱼岛": ["钓鱼岛"],
  "黄岩岛": ["黄岩岛"],
  "赤尾屿": ["赤尾屿"],
  "南沙群岛": ["南沙群岛"],
  "中沙群岛": ["中沙群岛"],
  "西沙群岛": ["西沙群岛"],
  "东沙群岛": ["东沙群岛"],
};

// 在文件顶部添加类型定义
type StreamEvent = {
  event: string;
  data: string;
}

type ChatMessage = {
  content: string;
  content_type: string;
  type: 'answer' | 'verbose' | 'follow_up';
}

const parseMarkdown = (text: string): string => marked.parse(text) as string;

const CityWeatherQuery = () => {
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<keyof ChineseRegions | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [botId, setBotId] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setShowDropdown(true);
  };

  // Get all cities across provinces
  const allCities = Object.values(CHINA_REGIONS).flat();

  // Find matches for autocomplete
  const getAutocompleteSuggestions = () => {
    if (!searchText) return [];
    return allCities.filter(city =>
      city.toLowerCase().startsWith(searchText.toLowerCase())
    );
  };

  const filteredCities = () => {
    if (!selectedProvince) return [];
    return CHINA_REGIONS[selectedProvince].filter(city =>
      city.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const handleCitySelect = async (city: string) => {
    setSearchText(city);
    setShowDropdown(false);

    try {
      // 1. Create conversation
      const createConvResponse = await fetch('https://api.coze.cn/v1/conversation/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: city,
            content_type: 'text'
          }]
        })
      });
      
      const convData = await createConvResponse.json();
      if (convData.code !== 0) {
        throw new Error(`Failed to create conversation: ${convData.msg}`);
      }

      // 2. Start chat with conversation ID
      const chatResponse = await fetch(`https://api.coze.cn/v3/chat?conversation_id=${convData.data.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bot_id: botId,
          user_id: 'default_user',
          stream: isStreaming,
          auto_save_history: true,
          additional_messages: [{
            role: 'user',
            content: city,
            content_type: 'text'
          }]
        })
      });

      if (isStreaming) {
        const reader = chatResponse.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentMessage = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';
          
          for (const eventText of events) {
            if (!eventText.trim()) continue;
            
            const lines = eventText.split('\n');
            const event: StreamEvent = {
              event: lines[0].replace('event:', ''),
              data: lines[1].replace('data:', '')
            };
            
            if (event.event === 'conversation.message.delta') {
              try {
                const messageData = JSON.parse(event.data) as ChatMessage;
                if (messageData.type === 'answer') {
                  currentMessage += messageData.content;
                  setResponse(parseMarkdown(currentMessage));
                }
              } catch (e) {
                console.error('Failed to parse message data:', e);
              }
            }
          }
        }
      } else {
        const data = await chatResponse.json();
        if (data.data?.messages?.[0]?.content) {
          setResponse(data.data.messages[0].content);
        } else {
          setResponse(JSON.stringify(data, null, 2));
        }
      }
    } catch (error) {
      setResponse('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchText}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            placeholder="输入城市名称"
            className="w-full p-2 border rounded-md"
          />
          
          {showDropdown && (
            <div ref={dropdownRef} className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
              {/* Autocomplete suggestions */}
              {searchText && (
                <div className="border-b">
                  {getAutocompleteSuggestions().map(city => (
                    <div
                      key={city}
                      className="p-2 cursor-pointer hover:bg-gray-50 text-blue-600"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Province-City selector */}
              <div className="flex h-96">
                <div className="w-1/3 border-r overflow-y-auto">
                  {(Object.keys(CHINA_REGIONS) as Array<keyof ChineseRegions>).map(province => (
                    <div
                      key={province}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        selectedProvince === province ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        setSelectedProvince(province);
                        setSearchText('');
                      }}
                    >
                      {province}
                    </div>
                  ))}
                </div>
                
                <div className="w-2/3 overflow-y-auto">
                  {selectedProvince && filteredCities().map(city => (
                    <div
                      key={city}
                      className="p-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Dialog>
          <DialogTrigger>
            <Settings className="w-6 h-6 text-gray-600 hover:text-gray-800" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>设置</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <label className="block mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Bot ID</label>
                <input
                  type="text"
                  value={botId}
                  onChange={(e) => setBotId(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="从智能体开发页面URL获取"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>启用流式输出</span>
                <Switch
                  checked={isStreaming}
                  onCheckedChange={setIsStreaming}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-md min-h-[200px]">
        <div className="prose max-w-none">
          <div 
            className="whitespace-pre-wrap text-gray-800"
            dangerouslySetInnerHTML={{ 
              __html: response || '等待查询...' 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CityWeatherQuery;