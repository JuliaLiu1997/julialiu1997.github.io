import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.BufferedReader;
import java.io.File;  
import java.io.FileReader;

public class Competition4 {


	public static class WordMapper extends Mapper<Object, Text, Text, IntWritable>{
		// result initiate
		private final static IntWritable pos = new IntWritable(1);
		private final static IntWritable neg = new IntWritable(-1);
		private final static IntWritable ave = new IntWritable(0);
		private Text id = new Text();
		
		// get word lists
		List<String> posWord = WordList.posWord;
		List<String> negWord = WordList.negWord;
		public void map(Object key, Text value, Context context) throws
		IOException, InterruptedException {
			//counters for compare number of positive and negative comments
			int posCount = 0;
			int negCount = 0;
			
			String line = value.toString();
			String[] fields = line.split("\t");
			String productId = fields[1];
			String body = fields[7];
			
			//check if how many words are positive, and how many are negative
			StringTokenizer tokenizer = new StringTokenizer(body);
			while (tokenizer.hasMoreTokens()) {
				String word = tokenizer.nextToken();
				if (posWord.contains(word)) {
					posCount++;
				}else if (negWord.contains(word)) {
					negCount++;
				}
			}
			
			// set product id and set the final result
			id.set(productId);
			if (posCount > negCount) {
				context.write(id, pos);
			}else if (posCount < negCount) {
				context.write(id, neg);
			}else {
				context.write(id, ave);
			}
		}
	}
	
	public static class IntSumReducer extends Reducer<Text, IntWritable, Text, Text> {
//	public static class IntSumReducer extends Reducer<Text, IntWritable, Text, ResultSet> {
		
		// final result initiate
		private final static Text pos = new Text("positive");
		private final static Text neg = new Text("negative");
		
		public void reduce(Text key, Iterator<IntWritable> values, Context context) throws IOException, InterruptedException {
			
			//counters for comparing number of positive and negative comments and for calculating positive rate
			int posCount = 0;
			int negCount = 0;
			int aveCount = 0;
			
			// count for results
			while (values.hasNext()) {
				int value = values.next().get();
				if (value > 0) {
					posCount++;
				}else if (value < 0) {
					negCount++;
				}else {
					aveCount++;
				}
			}
			
			// Normal output: a list of product ids and the corresponding majority view of the customers
			if (posCount >= negCount) {
				context.write(key, pos);
			}else if (posCount < negCount) {
				context.write(key, neg);
			}
			
			// Bonus output: a list of product ids, the corresponding number of reviews per product and the corresponding percentage of positive reviews per product
			
			/*
			 * int numReview = posCount+negCount+aveCount; double posRate =
			 * posCount/numReview; ResultSet resultSet = new ResultSet(numReview, posRate);
			 * context.write(key, resultSet);
			 */
			 
				
		}
	}
	
	//Load all the positive and negative words in two lists
	public static class WordList{
		public static List<String> posWord = LoadList("src/positive.txt");
		public static List<String> negWord = LoadList("src/negative.txt");
		
		// Function that used to load words into list from a txt file
		public static List<String> LoadList(String filepath){
			List<String> lst = new ArrayList<String>();
			File file = new File(filepath);  
			BufferedReader reader = null; 
			try {  
	            reader = new BufferedReader(new FileReader(file));  
	            String tempString = null; 
	            while ((tempString = reader.readLine()) != null) { 
	            	// ignore empty lines and comment lines
	            	if(tempString.length() == 0 || tempString.charAt(0) == ';')
	            		continue;
	                lst.add(tempString);  
	            }  
	            reader.close();  
	        } catch (IOException e) {  
	            e.printStackTrace();  
	        } finally {  
	            if (reader != null) {  
	                try {  
	                    reader.close();  
	                } catch (IOException e1) {  
	                }  
	            }  
	        }
			return lst;
		}
	}
	
	public static void main(String[] args) throws Exception {
		Configuration conf = new Configuration();
		Job job = Job.getInstance(conf, "Competition4");
		job.setJarByClass(Competition4.class);
		job.setMapperClass(WordMapper.class);
		job.setCombinerClass(IntSumReducer.class);
		job.setReducerClass(IntSumReducer.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
		//job.setOutputValueClass(ResultSet.class);
		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));
		System.exit(job.waitForCompletion(true) ? 0 : 1);
	}

}
