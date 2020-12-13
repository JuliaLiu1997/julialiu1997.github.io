import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

import org.apache.hadoop.io.Writable;

// For Bonus output: number of reviews per product and the corresponding percentage of positive reviews per product
	public class ResultSet implements Writable{
		private int numReview;
		private double posRate;
		
		public ResultSet(int numReview, double posRate) {
			this.numReview = numReview;
			this.posRate = posRate;
		}
		
		public void write(DataOutput out) throws IOException {
			out.writeInt(numReview);
			out.writeDouble(posRate);
			
		}
		
		public void readFields(DataInput in) throws IOException{
			numReview = in.readInt();
			posRate = in.readDouble();
		}
		
		@Override
		public String toString() {
			return numReview + "\t" + posRate;
		}
	}

