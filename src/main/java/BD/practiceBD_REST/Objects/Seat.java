package BD.practiceBD_REST.Objects;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Seat {

    private int id;

    private int id_classroom;

    private String number;

    private String WS_name;

    private String ip;

    private String note;
}
