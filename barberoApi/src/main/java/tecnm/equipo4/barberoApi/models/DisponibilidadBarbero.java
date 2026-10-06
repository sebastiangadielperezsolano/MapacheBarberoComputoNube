package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.DateFormat;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data

@Table (name = "disponibilidadB")
public class DisponibilidadBarbero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDisponibilidad;

    @Column(nullable = false)
    private DateFormat dia;

    @Column(nullable = false)
    private String diaEntrada;

    @Column(nullable = false)
    private String diaSalida;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idUsuario")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Barbero barbero;
}
